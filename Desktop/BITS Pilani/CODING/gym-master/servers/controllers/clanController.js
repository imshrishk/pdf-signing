const express = require("express");
const Clan = require("../models/clanModel"); // Ensure the correct path
const User = require("../models/userModel"); // Ensure the correct path
const ClanName = require("../models/clanUserModel"); // Ensure the correct path
const ClanUser = require("../models/clanUserModel");
const ClanChat = require("../models/clanChatModel");

async function fetchAllClans(req, res) {
  try {
    const clans = await Clan.find({});
    if (!clans) {
      return res.status(409).json({ error: "No clans registered" });
    }
    return res.json({clans});
  } 
  catch (error) {
    console.error("Error during fetch up:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createClan(req, res) {
  try {
    const { clanName } = req.body;
    const user = req.user;
    const userId = user.id;
    
    const clanAlready = await Clan.findOne({ name: clanName });
    if (clanAlready) {
      return res.status(400).send("Clan name in use");
    }

    // Create the new clan
    const clan = new Clan({
      name: clanName,
      members: [userId],
      clanLeader: userId,
    });
    await clan.save();

    // Find and update the user's clans
    const userClan = await ClanUser.findOne({ uid: userId });
    if (userClan) {
      userClan.clanIds.push(clan._id);
      userClan.clanNames.push(clanName);
      await userClan.save();
    } else {
      // If the user doesn't exist in ClanUser, create a new entry
      const newUserClan = new ClanUser({
        uid: userId,
        clanIds: [clan._id],
        clanNames: [clanName],
      });
      await newUserClan.save();
    }

    res.send(`${clanName} was created!`);
    console.log(req.body);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

async function sendMessage(req, res) {
  try {
    const { clanName, message } = req.body;
    const userEmail = req.user.email; // Assuming req.user contains the authenticated user's details
    console.log(req.user);
    // Ensure message is correctly structured based on MessageSchema
    const newMessage = {
      senderEmail: userEmail, // Assuming userId is the ObjectId of the sender (User model)
      content: message.content,
      timestamp: message.timestamp || Date.now(), // Use provided timestamp or default to current time
    };

    // Find the clan by name and update the messages array
    const clan = await ClanChat.findOneAndUpdate(
      { clanName: clanName },
      {
        $addToSet: { messages: newMessage }, // Use newMessage object here
      },
      { new: true, upsert: false } // Ensure upsert is false to avoid creating new documents
    );
    res.status(200).send("Message added succesfully "); // Send updated clan data back to the client
    console.log("Mesage added succesfully",newMessage)// Send updated clan data back to the client
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).send("Error sending message"); // Handle errors appropriately
  }
}

async function joinClan(req, res) {
  try {
    const { clanName } = req.body;

    if (!clanName) {
      return res.status(400).send("Missing clanName");
    }

    const user = req.user;
    const userId = user.id;

    const steps = user.steps;

    // Find the clan by name and update the members array
    const clan = await Clan.findOneAndUpdate(
      { name: clanName },
      {
        $addToSet: { members: userId }, // $addToSet ensures no duplicates
        //$inc: { steps: steps } // Increment the steps field by the value of steps
      },
      { new: true, upsert: false } // Ensure upsert is false to avoid creating new documents
    );


    if (!clan) {
      console.log("No such clan");
      return res.status(404).send("Clan not found");
    }

    const clanId = clan._id;

    const clanUser = await ClanUser.findOneAndUpdate(
      { uid: userId }, // Query to find the user
      {
        $addToSet: { clanNames: clanName, clanIds: clanId }, // $addToSet ensures no duplicates
      },
      { upsert: true, new: true, setDefaultsOnInsert: true } // upsert creates a new document for if user hasnt joined any clans
    );

    console.log("Updated clan:", clan);
    res.send("User ID added to clan");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
}


async function viewAllClans(req, res) {
  try {
    const clans = await Clan.find({})
      .populate("clanLeader", "name")
      .populate("members", "name");

    res.json(clans);
  } catch (error) {
    console.error("Error fetching all clans:", error);
    res.status(500).json({ error: "Server error" });
  }
}



async function viewClans(req, res) {
  try {
    const user = req.user;

    const userId = user.id;

    const clans = await ClanName.findOne({ uid: userId });

    if (!clans) {
      console.log("user hasnt linked their id with clans");
      return res.status(404).send("error for being a bitch");
    }

    console.log(clans.clanNames);
    res.json(clans.clanNames);
  } catch (error) {
    console.log(error);
  }
}
async function viewClanMembers(req, res) {
  try {
    const clanName = req.body.clanName; // assuming clanName is sent in the request body

    const clan = await Clan.findOne({ name: clanName }).populate('members');

    if (!clan) {
      console.log("No such clan exists");
      return res.status(404).send("No such clan exists");
    }

    console.log(clan.members);
    res.json(clan.members);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
}

async function clanChats(req, res) {
  try {
    const { clanName } = req.body;
    const userId = req.user.id;

    // Check if the user belongs to the clan
    const user = await Clan.findOne({ name: clanName, members: userId });
    if (!user) {
      return res.status(400).json({ message: "You are not a member of that clan" });
    }

    // Retrieve clan chat messages or create a new clanObject if not found
    let clanObject = await ClanChat.findOne({ clanName: clanName });
    if (!clanObject) {
      clanObject = new ClanChat({ clanName: clanName, messages: [] });
      await clanObject.save();
    }

    // Sort messages by timestamp in descending order and get the last 20
    const sortedMessages = clanObject.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    const last20Messages = sortedMessages.reverse();

    // Send the sorted and limited chat messages
    res.json(last20Messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}


//  whenever user retrieves clan chats he sees the last 20 messages...the issue is since mongo if i had to retreive the last 20 messages from the a clan which is dormant, would mean that i would have to search through messages of A LOT of active clans... so bad. instead i could have a CLANCHAT model where  {clanId: messages:{}}}
// redirect the user to React /viewchat with response passed in.... create a react component from the index.html which takes the response, generates a texts based on clanChat ui.
module.exports = { createClan, joinClan, viewClans, clanChats, sendMessage, viewAllClans, viewClanMembers, fetchAllClans };