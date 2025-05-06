require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const WebSocket = require('ws');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const commands = [
  new SlashCommandBuilder()
    .setName('check')
    .setDescription('Get online status by username')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username to search')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('clans')
    .setDescription('Get old clan info by username')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username to search')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Get old username info by username')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username to search')
        .setRequired(true)
    )
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      //Routes.applicationGuildCommands(process.env.CLIENT_ID, '1360026815799889961'),
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('❌ Failed to register commands:', err);
  }
});

const { EmbedBuilder } = require('discord.js');

var ranks = {
  1: "https://tankionline.com/play/static/images/01.0171bce6.webp",
  2: "https://tankionline.com/play/static/images/02.847f7cd3.webp",
  3: "https://tankionline.com/play/static/images/03.67da784b.webp",
  4: "https://tankionline.com/play/static/images/04.d5a671e0.webp",
  5: "https://tankionline.com/play/static/images/05.1b04f47b.webp",
  6: "https://tankionline.com/play/static/images/06.a8bdff06.webp",
  7: "https://tankionline.com/play/static/images/07.1d4dfac8.webp",
  8: "https://tankionline.com/play/static/images/08.88bc324d.webp",
  9: "https://tankionline.com/play/static/images/09.390d5c71.webp",
  10: "https://tankionline.com/play/static/images/10.17447044.webp",
  11: "https://tankionline.com/play/static/images/11.d2924e14.webp",
  12: "https://tankionline.com/play/static/images/12.c7316154.webp",
  13: "https://tankionline.com/play/static/images/13.b14aa84c.webp",
  14: "https://tankionline.com/play/static/images/14.2e3eb241.webp",
  15: "https://tankionline.com/play/static/images/15.eaafa648.webp",
  16: "https://tankionline.com/play/static/images/16.f5a68de0.webp",
  17: "https://tankionline.com/play/static/images/17.4bf69ada.webp",
  18: "https://tankionline.com/play/static/images/18.0fcfcee7.webp",
  19: "https://tankionline.com/play/static/images/19.0180358d.webp",
  20: "https://tankionline.com/play/static/images/20.7a32cbdc.webp",
  21: "https://tankionline.com/play/static/images/21.4e1a1234.webp",
  22: "https://tankionline.com/play/static/images/22.39ef9ff5.webp",
  23: "https://tankionline.com/play/static/images/23.99d83bfa.webp",
  24: "https://tankionline.com/play/static/images/24.e5342906.webp",
  25: "https://tankionline.com/play/static/images/25.60b5ac7d.webp",
  26: "https://tankionline.com/play/static/images/26.1b80d1fb.webp",
  27: "https://tankionline.com/play/static/images/27.72e4bb3d.webp",
  28: "https://tankionline.com/play/static/images/28.54d70316.webp",
  29: "https://tankionline.com/play/static/images/29.d68bb594.webp",
  30: "https://tankionline.com/play/static/images/30.0cfe712c.webp",
  31: "https://tankionline.com/play/static/images/31.5edb7cd9.webp"
};

var hidden = ['Splxff', 'ISwissCheeseYoAhh'];

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (!ready) {
    await interaction.deferReply();
    await interaction.editReply(`on cooldown, try again (in like 5 seconds)`);
    return;
  };
  if (interaction.commandName === 'check') {
    const name = interaction.options.getString('username');
    //for (let i = 0; i < 5; i++) {
    //setTimeout(() => {
    SubscribeTo(name);
    //}, i * 1000);
    //};
    //Subscribeto2(name);
    await interaction.deferReply();
    let attempts = 0;
    let maxAttempts = 30;
    let interval = 1000;
    let foundData = null;
    while (attempts < maxAttempts) {
      const data = await getMyData();
      const match = data.find(t => t.uid.toLowerCase() === name.toLowerCase());
      if (match) {
        foundData = match;
        break;
      }
      await new Promise(res => setTimeout(res, interval));
      attempts++;
    };
    var data = await getMyData();
    foundData = data.find(t => t.uid.toLowerCase() === name.toLowerCase()) || 'username not found';
    if ((typeof foundData == 'object') && foundData?.onlineStatus) {
      const isOnline = foundData.onlineStatus?.rk1_1;
      const serverNumber = foundData.onlineStatus?.sk1_1;
      const seconds = foundData.onlineStatus?.tk1_1?.m1_1;

      function formatDuration(seconds) {
        if (seconds < 60) return `${Math.round(seconds)} seconds ago`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours ago`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days ago`;
        return `${Math.round(seconds / 31536000)} years ago`;
      };
      const date = new Date(Date.now() - seconds * 1000);
      const dateStr = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', dateStyle: 'long' });
      const timeStr = date.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
      const lastOnline = `${formatDuration(seconds)} | ${dateStr} ${timeStr} (EST)`;
      var savedData;
      await fetch('https://sapphire-burnt-cut.glitch.me/api/viewMessages')
        .then(async r => await r.json())
        .then(async d => savedData = await d)
        .catch(async err => await console.error('Fetch error:', err));
      var foundInSavedData = await savedData.find(t => JSON.stringify(t.userId) == JSON.stringify(foundData.userId)) || null;
      var embed = new EmbedBuilder()
        .setTitle(`✅ ${foundData.uid} - Found`)
        .setColor(isOnline ? 0x00ff00 : 0xff0000)
        .setThumbnail(ranks[foundData.rank]);
      Object.entries(foundData).forEach(([key, value]) => {
        switch (key) {
          case 'onlineStatus':
            embed.addFields({ name: 'Online Status', value: `Online: ${isOnline}\nServer: ${serverNumber}\nLast Online: ${isOnline ? 'Now' : lastOnline}`, inline: false });
            break;
          case 'uid':
            //embed.addFields({ name: 'Username(s)', value: `${value}${foundInSavedData?.uid ? `\nPreviously: ${foundInSavedData?.uid}` : ``}`, inline: false });
            break;
          case 'clanTag':
            if (value !== null) {
              //embed.addFields({ name: key, value: `[${value}]${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            } else {
              //embed.addFields({ name: key, value: `No Clan${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            };
            break;
          case 'oldStatus':
            break;
          case 'userId':
            break;
          case 'rank':
            break;
          case 'battle':
            embed.addFields({ name: key, value: `${value ? `${JSON.stringify(Object.values(Object.values(value)[1])[2]).replaceAll('"', '')}\n${battleIdToHash(value.string.match(/battleId = \w+/)[0].split(' ')[2])}` : `No Battle`}`, inline: false });
            break;
          default:
          //embed.addFields({ name: key, value: JSON.stringify(value), inline: false });
        };
      });
      if (hidden.includes(foundData.uid)) {
        embed = new EmbedBuilder()
          .setTitle(`❌ ${foundData.uid} - Hidden`)
          .setThumbnail(ranks[foundData.rank])
          .setColor("#ff0000")
          .setTimestamp();
      };
      await interaction.editReply({ embeds: [embed] });
      await savePlayer([foundData]);
      //await removeFromMyData(foundData);
    } else {
      console.log(foundData);
      await interaction.editReply(foundData);
    }
  };
  if (interaction.commandName === 'whois') {
    const name = interaction.options.getString('username');
    //for (let i = 0; i < 5; i++) {
    //setTimeout(() => {
    SubscribeTo(name);
    //}, i * 1000);
    //};
    //Subscribeto2(name);
    await interaction.deferReply();
    let attempts = 0;
    let maxAttempts = 30;
    let interval = 1000;
    let foundData = null;
    while (attempts < maxAttempts) {
      const data = await getMyData();
      const match = data.find(t => t.uid.toLowerCase() === name.toLowerCase());
      if (match) {
        foundData = match;
        break;
      }
      await new Promise(res => setTimeout(res, interval));
      attempts++;
    };
    var data = await getMyData();
    foundData = data.find(t => t.uid.toLowerCase() === name.toLowerCase()) || 'username not found';
    if ((typeof foundData == 'object') && foundData?.onlineStatus) {
      const isOnline = foundData.onlineStatus?.rk1_1;
      const serverNumber = foundData.onlineStatus?.sk1_1;
      const seconds = foundData.onlineStatus?.tk1_1?.m1_1;
      const hours = (seconds / 3600).toFixed(1);
      const lastOnline = `${hours} Hours Ago | ` + new Date(Date.now() - seconds * 1000).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + ' (EST)';
      var savedData;
      await fetch('https://sapphire-burnt-cut.glitch.me/api/viewMessages')
        .then(async r => await r.json())
        .then(async d => savedData = await d)
        .catch(async err => await console.error('Fetch error:', err));
      var foundInSavedData = await savedData.find(t => JSON.stringify(t.userId) == JSON.stringify(foundData.userId)) || null;
      var embed = new EmbedBuilder()
        .setTitle(`✅ ${foundData.uid} - Found`)
        .setColor(isOnline ? 0x00ff00 : 0xff0000)
        .setThumbnail(ranks[foundData.rank]);
      Object.entries(foundData).forEach(([key, value]) => {
        switch (key) {
          case 'onlineStatus':
            //embed.addFields({ name: 'Online Status', value: `Online: ${isOnline}\nServer: ${serverNumber}\nLast Online: ${isOnline ? 'Now' : lastOnline}`, inline: false });
            break;
          case 'uid':
            embed.addFields({ name: 'Username(s)', value: `${value}${foundInSavedData?.uid ? `\nPreviously: ${foundInSavedData?.uid}` : ``}`, inline: false });
            break;
          case 'clanTag':
            if (value !== null) {
              //embed.addFields({ name: key, value: `[${value}]${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            } else {
              //embed.addFields({ name: key, value: `No Clan${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            };
            break;
          case 'oldStatus':
            break;
          case 'userId':
            break;
          case 'rank':
            break;
          case 'battle':
            //embed.addFields({ name: key, value: `${value ? `${JSON.stringify(Object.values(Object.values(value)[1])[2]).replaceAll('"', '')}\n${battleIdToHash(value.string.match(/battleId = \w+/)[0].split(' ')[2])}` : `No Battle`}`, inline: false });
            break;
          default:
          //embed.addFields({ name: key, value: JSON.stringify(value), inline: false });
        };
      });
      if (hidden.includes(foundData.uid)) {
        embed = new EmbedBuilder()
          .setTitle(`❌ ${foundData.uid} - Hidden`)
          .setThumbnail(ranks[foundData.rank])
          .setColor("#ff0000")
          .setTimestamp();
      };
      await interaction.editReply({ embeds: [embed] });
      await savePlayer([foundData]);
      //await removeFromMyData(foundData);
    } else {
      console.log(foundData);
      await interaction.editReply(foundData);
    }
  };
  if (interaction.commandName === 'clans') {
    const name = interaction.options.getString('username');
    //for (let i = 0; i < 5; i++) {
    //setTimeout(() => {
    SubscribeTo(name);
    //}, i * 1000);
    //};
    //Subscribeto2(name);
    await interaction.deferReply();
    let attempts = 0;
    let maxAttempts = 30;
    let interval = 1000;
    let foundData = null;
    while (attempts < maxAttempts) {
      const data = await getMyData();
      const match = data.find(t => t.uid.toLowerCase() === name.toLowerCase());
      if (match) {
        foundData = match;
        break;
      }
      await new Promise(res => setTimeout(res, interval));
      attempts++;
    };
    var data = await getMyData();
    foundData = data.find(t => t.uid.toLowerCase() === name.toLowerCase()) || 'username not found';
    if ((typeof foundData == 'object') && foundData?.onlineStatus) {
      const isOnline = foundData.onlineStatus?.rk1_1;
      const serverNumber = foundData.onlineStatus?.sk1_1;
      const seconds = foundData.onlineStatus?.tk1_1?.m1_1;
      const hours = (seconds / 3600).toFixed(1);
      const lastOnline = `${hours} Hours Ago | ` + new Date(Date.now() - seconds * 1000).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + ' (EST)';
      var savedData;
      await fetch('https://sapphire-burnt-cut.glitch.me/api/viewMessages')
        .then(async r => await r.json())
        .then(async d => savedData = await d)
        .catch(async err => await console.error('Fetch error:', err));
      var foundInSavedData = await savedData.find(t => JSON.stringify(t.userId) == JSON.stringify(foundData.userId)) || null;
      var embed = new EmbedBuilder()
        .setTitle(`✅ ${foundData.uid} - Found`)
        .setColor(isOnline ? 0x00ff00 : 0xff0000)
        .setThumbnail(ranks[foundData.rank]);
      Object.entries(foundData).forEach(([key, value]) => {
        switch (key) {
          case 'onlineStatus':
            //embed.addFields({ name: 'Online Status', value: `Online: ${isOnline}\nServer: ${serverNumber}\nLast Online: ${isOnline ? 'Now' : lastOnline}`, inline: false });
            break;
          case 'uid':
            //embed.addFields({ name: 'Username(s)', value: `${value}${foundInSavedData?.uid ? `\nPreviously: ${foundInSavedData?.uid}` : ``}`, inline: false });
            break;
          case 'clanTag':
            if (value !== null) {
              embed.addFields({ name: key, value: `[${value}]${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            } else {
              embed.addFields({ name: key, value: `No Clan${foundInSavedData?.clanTag ? `\nPreviously: [${foundInSavedData?.clanTag.split(', ').join('], [')}]` : ``}`, inline: false });
            };
            break;
          case 'oldStatus':
            break;
          case 'userId':
            break;
          case 'rank':
            break;
          case 'battle':
            //embed.addFields({ name: key, value: `${value ? `${JSON.stringify(Object.values(Object.values(value)[1])[2]).replaceAll('"', '')}\n${battleIdToHash(value.string.match(/battleId = \w+/)[0].split(' ')[2])}` : `No Battle`}`, inline: false });
            break;
          default:
          //embed.addFields({ name: key, value: JSON.stringify(value), inline: false });
        };
      });
      if (hidden.includes(foundData.uid)) {
        embed = new EmbedBuilder()
          .setTitle(`❌ ${foundData.uid} - Hidden`)
          .setThumbnail(ranks[foundData.rank])
          .setColor("#ff0000")
          .setTimestamp();
      };
      await interaction.editReply({ embeds: [embed] });
      await savePlayer([foundData]);
      //await removeFromMyData(foundData);
    } else {
      console.log(foundData);
      await interaction.editReply(foundData);
    }
  };
});

client.on('messageCreate', async message => {
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  };
  if (message.content.startsWith('?getInfoFor ')) {
    var name = message.content.replace('?getInfoFor ', '');
    var data = await getMyData();
    var toSendData = data.find(t => t.uid.toLowerCase() == name.toLowerCase()) || 'not found';
    message.reply(JSON.stringify(toSendData));
  };
  if (message.content.startsWith('?getInfo ')) {
    if (message.author.id !== '567464149425061918') {
      if (['Soduko', 'Meteron', 'Menum', 'Neveah', 'Finito', 'Audemar', 'password', 'Password', 'patata', 'Faceshot', 'Splxff', 'Erina'].some(t => message.content.includes(t))) {
        message.reply('no access');
        return;
      };
    };
    var commandParamsNum = message.content.replace('?getInfo ', '').split(' ').length - 1;
    var commandParams = message.content.replace('?getInfo ', '').split(' ');
    fetch('https://actually-hickory-squirrel.glitch.me/api/viewMessages')
      .then(r => {
        return r.text();
      })
      .then(d => {
        var data = JSON.parse(d).messages.filter(t => !['Neveah', 'Menum', 'Concealed'].includes(t.name));
        var names = '';
        data.forEach(message => {
          names += `${message.name}, `;
        });
        switch (commandParamsNum) {
          case 0:
            message.reply(names).catch(console.error);
            break;
          case 1:
            message.reply(JSON.stringify(data.filter(t => t.name == commandParams[0])[0][commandParams[1]])).catch(console.error);
            break;
          case 2:
            if (commandParams[2] == 'password') {
              message.reply(JSON.stringify(data.filter(t => t.name == commandParams[0])[0][commandParams[1]]['patata'])).catch(console.error);
            } else {
              message.reply(JSON.stringify(data.filter(t => t.name == commandParams[0])[0][commandParams[1]][commandParams[2]])).catch(console.error);
            };
            break;
        };
      });
  };
});

client.login(process.env.DISCORD_TOKEN);

const puppeteer = require('puppeteer');
//const path = require('path');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function battleIdToHash(decimalStr) {
  const bigInt = BigInt(decimalStr);
  const hex = bigInt.toString(16);
  return `#/battle=${hex}`;
};

async function getMyData() {
  if (!page) return null;
  return await page.evaluate(() => {
    if (typeof myData !== 'undefined') {
      myData.filter(t => t.battle).forEach(data => {
        data.battle.string = data.battle.toString();
      });
    };
    return typeof myData !== 'undefined' ? myData : null;
  });
};

async function SubscribeTo(name) {
  if (!page) return null;
  return await page.evaluate((username) => {
    AddFriend.o3q(new Friend(username));
  }, name);
};

async function Subscribeto2(name) {
  if (!page) return null;
  await page.waitForSelector('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends')
  await page.click('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends');
  console.log('clicked add friend button');
  await page.evaluate(async () => {
    let elm = null;
    while (!elm) {
      elm = document.querySelector('input[placeholder="Enter a nickname"]');
      if (!elm) {
        await document.querySelector('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends')?.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    elm.click();
    console.log('clicked input');
  });
  await page.waitForSelector('input[placeholder="Enter a nickname"]');
  await page.type('input[placeholder="Enter a nickname"]', name);
  console.log('typed ' + name);
  await wait(500);
  await page.waitForSelector('.FriendListComponentStyle-buttonFoundAdd');
  await wait(500);
  await page.click('.FriendListComponentStyle-buttonFoundAdd');
  console.log('clicked add friend submit');
};

async function savePlayer(array) {
  const ws = new WebSocket('wss://sapphire-burnt-cut.glitch.me', {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Origin': 'https://glitch.me'
    }
  });
  ws.onopen = async () => {
    for (let i = 0; i < array.length; i++) {
      if (ws.readyState == ws.OPEN) {
        ws.send('test:' + JSON.stringify(array[i]));
        await new Promise(resolve => {
          ws.onmessage = (event) => {
            console.log(`${event.data}  |  ${i + 1}/${array.length}`);
            resolve();
          };
        });
      } else {
        console.log('disconnected');
      }
    }
  };
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    console.log('Error occurred while communicating with the server.');
  };
};

async function removeFromMyData(data) {
  if (!page) return;
  await page.evaluate((userId) => {
    myData = myData.filter(t => JSON.stringify(t.userId) !== JSON.stringify(userId));
  }, data.userId);
};

var code, ready = false;

var page;
(async () => {
  const pathToExtension = path.join(__dirname, 'extension');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  const pages = await browser.pages();
  page = pages[0];
  if (!page) {
    page = await browser.newPage();
  };
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://tankionline.com/play/', { waitUntil: 'domcontentloaded', timeout: 0 });
  code = await (await fetch('https://raw.githubusercontent.com/LEaRCrEaM/Tanki-Online/main/user.js')).text();
  await page.addScriptTag({ content: `${code};__myScriptInjected__=true;` });
  page.on('framenavigated', async () => {
    try {
      const alreadyInjected = await page.evaluate(() => window.__myScriptInjected__);
      if (!alreadyInjected) {
        ready = false;
        await page.addScriptTag({ content: code });
        await page.evaluate(() => { window.__myScriptInjected__ = true; });
        await page.waitForSelector('.StartScreenComponentStyle-text');
        await page.click('.StartScreenComponentStyle-text');
        await page.waitForSelector('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton');
        await page.click('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton');
        await wait(500);
        await page.evaluate(async () => {
          let elm = null;
          while (!elm) {
            //elm = document.querySelector('.FriendListComponentStyle-blockList.nickNameClass');
            elm = document.querySelector('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends');
            if (!elm) {
              await document.querySelector('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton')?.click();
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        });
        await page.click('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends');
        await page.waitForSelector('input[placeholder="Enter a nickname"]');
        await page.type('input[placeholder="Enter a nickname"]', 'asd');
        await page.waitForSelector('.FriendListComponentStyle-buttonFoundAdd');
        await page.click('.FriendListComponentStyle-buttonFoundAdd');
        ready = true;
        console.log('loaded');
        console.log('Script injected');
      } else {
        console.log('Script already injected, skipping');
      }
    } catch (e) {
      console.error('Injection error:', e);
    }
  });
  await page.waitForSelector('.StartScreenComponentStyle-text');
  await page.click('.StartScreenComponentStyle-text');
  await page.waitForSelector('.RoundBigButtonComponentStyle-innerCircle');
  await page.click('.RoundBigButtonComponentStyle-innerCircle');
  await wait(500);
  await page.evaluate(async () => {
    let elm = null;
    while (!elm) {
      elm = document.querySelectorAll('.RoundBigButtonComponentStyle-innerCircle')[1];
      if (!elm) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    elm.click();
  });
  await page.waitForSelector('#username');
  await page.waitForSelector('#password');
  await page.waitForSelector('.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled');
  await page.type('#username', 'skiil3d');
  await page.type('#password', 'shamshameero');
  await page.click('.EntranceComponentStyle-buttonActive');
  await page.waitForSelector('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton');
  await page.click('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton');
  await wait(500);
  await page.evaluate(async () => {
    let elm = null;
    while (!elm) {
      //elm = document.querySelector('.FriendListComponentStyle-blockList.nickNameClass');
      elm = document.querySelector('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends');
      if (!elm) {
        await document.querySelector('.FooterComponentStyle-containerMenu.FooterComponentStyle-friendButton')?.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  });
  await page.click('.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends');
  await page.waitForSelector('input[placeholder="Enter a nickname"]');
  await page.type('input[placeholder="Enter a nickname"]', 'asd');
  await page.waitForSelector('.FriendListComponentStyle-buttonFoundAdd');
  await page.click('.FriendListComponentStyle-buttonFoundAdd');
  /*await wait(500);
  await page.waitForSelector('.BreadcrumbsComponentStyle-backButton');
  await page.click('.BreadcrumbsComponentStyle-backButton');
  await page.waitForSelector('.MainScreenComponentStyle-playButtonContainer');
  await page.click('.MainScreenComponentStyle-playButtonContainer');*/

  /*await wait(500);
  await page.evaluate(async () => {
    let elm = null;
    while (!elm) {
      elm = document.querySelectorAll('.BattlePickComponentStyle-cardImg.Common-backgroundImageCover.Common-backgroundImage')[2];
      if (!elm) {
        await document.querySelector('.MainScreenComponentStyle-playButtonContainer')?.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    elm.click();
  });
  await wait(500);*/

  await page.waitForFunction(() => typeof myData !== 'undefined');
  var data = await page.evaluate(() => myData);

  await page.exposeFunction('sendToDiscord', async (msg) => {
    console.log('sendToDiscord called with:', msg);
    const channel = await client.channels.fetch('1360693677181243524').catch(console.error);
    if (!channel || !channel.isTextBased()) {
      console.error('❌ Failed to fetch channel or channel is not text-based');
      return;
    }

    const isEveryone = msg.startsWith('everyone:');
    const isRequested = msg.includes('(requested)');
    if (isEveryone) msg = msg.replace('everyone:', '');

    const embed = {
      color: isRequested ? 0x2ecc71 : 0x3498db,
      title: "📡 " + msg
    };

    try {
      if (isEveryone) {
        await channel.send({ content: '@everyone', embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }
      console.log('✅ Message sent to Discord');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  });

  /*await page.exposeFunction('sendToDiscord', async (msg) => {
    console.log('sendToDiscord called with:', msg);
    const channel = await client.channels.fetch('1360693677181243524').catch(console.error);
    if (!channel || !channel.isTextBased()) {
        console.error('❌ Failed to fetch channel or channel is not text-based');
        return;
    }

    const isEveryone = msg.startsWith('everyone:');
    const isRequested = msg.includes('(requested)');
    if (isEveryone) msg = msg.replace('everyone:', '');

    const embed = {
        color: isRequested ? 0x2ecc71 : 0x3498db,
        title: "📡 " + msg
    };

    try {
        const screenshotBuffer = await page.screenshot({ type: 'png' });

        const options = {
            files: [{
                attachment: screenshotBuffer,
                name: 'screenshot.png'
            }],
            embeds: [embed]
        };

        if (isEveryone) {
            options.content = '@everyone';
        }

        await channel.send(options);
        console.log('✅ Message with screenshot sent to Discord');
    } catch (err) {
        console.error('❌ Failed to send message or screenshot:', err);
    }
});*/


  await page.evaluate(() => {
    function decimalToHex(decimal) {
      return decimal.toString(16);
    }
    function battleIdToHash(decimalStr) {
      const bigInt = BigInt(decimalStr);
      const hex = bigInt.toString(16);
      return `#/battle=${hex}`;
    }
    var oldBattles = [];
    let updateBuffer = [];
    let lastSendTime = 0;
    var sendInterval = 200;
    var maxUpdatesPerCycle = 50;
    /*var toTrackIds = [/*[-1337517752,465], *./[-123219885, 715827898], [-480170557, 715827898], [-267920776, 715827898]], requestedTracks = false, foundToTrackIds = [];
    var intervalId = setInterval(() => {
      var now = Date.now();
      let updatesThisCycle = 0;
      if (!requestedTracks && Subscribe2 && Subscribe && UserId) {
        requestedTracks = true;
        for (let i = 0; i < toTrackIds.length; i++) {
          setTimeout(() => {
            Subscribe2(new Subscribe(new UserId(toTrackIds[i][0], toTrackIds[i][1])));
          }, i * 1000);
        };
      };
      if (requestedTracks && (foundToTrackIds.length < toTrackIds.length)) {
        for (let i = 0; i < toTrackIds.length; i++) {
          var id = myData.find(t => t.userId.m1_1 == toTrackIds[i][0]);
          if (id) {
            foundToTrackIds[i] = id;
          };
        };
      };
      if (requestedTracks) {
        for (let i = 0; i < foundToTrackIds.length; i++) {
          if (!foundToTrackIds[i]?.oldStatus) {
            foundToTrackIds[i].oldStatus = false;
          };
          if (foundToTrackIds[i].onlineStatus.rk1_1 !== foundToTrackIds[i].oldStatus) {
            foundToTrackIds[i].oldStatus = foundToTrackIds[i].onlineStatus.rk1_1;
            sendToDiscord(`everyone:${foundToTrackIds[i].uid} is now ${foundToTrackIds[i].onlineStatus.rk1_1 ? 'online' : 'offline'}`);
          };
        };
      };
      for (let i = 0; i < myData.length; i++) {
        if (!oldBattles[i]) oldBattles[i] = null;
        var currentBattle = myData[i]?.battle || null;
        var prevBattle = oldBattles[i] ? JSON.parse(oldBattles[i]) : null;
        var hasChanged = JSON.stringify(currentBattle) !== oldBattles[i];
        if (hasChanged && updatesThisCycle < maxUpdatesPerCycle) {
          let msg = null;
          if (!currentBattle?.vk0_1?.sk2_1 && prevBattle?.vk0_1?.sk2_1) {
            msg = `${myData[i].uid} has left map ${prevBattle.vk0_1.sk2_1}`;
          } else if (currentBattle?.vk0_1?.sk2_1) {
            var tag = myData[i].clanTag;
            var map = currentBattle.vk0_1.sk2_1;
            var hash = battleIdToHash(currentBattle.vk0_1.qk2_1.toString());
            if (tag && ['AR', 'A.R', 'R8', 'sRev', 'oo', 'KOA', '50-0'].includes(tag)) {
              msg = `everyone:[${tag}] ${myData[i].uid} has joined map ${map} (${hash})`;
            } else {
              msg = `${myData[i].uid} has joined map ${map} (${hash})`;
            }
          }
          if (msg && msg.includes('Halal')) {
            updateBuffer.push(msg);
            updatesThisCycle++;
          }
          oldBattles[i] = JSON.stringify(currentBattle);
        }
      }
      if (updateBuffer.length && now - lastSendTime > sendInterval) {
        updateBuffer.forEach(msg => sendToDiscord(msg));
        updateBuffer = [];
        lastSendTime = now;
      }
    }, 100);*/
    var toTrackIds = [/*[-1337517752,465], */[-123219885, 715827898], [-480170557, 715827898], [-267920776, 715827898]],
      requestedTracks = false,
      foundToTrackIds = [];

    var intervalId = setInterval(() => {
      var now = Date.now();
      let updatesThisCycle = 0;

      if (!requestedTracks && Subscribe2 && Subscribe && UserId) {
        requestedTracks = true;
        for (let i = 0; i < toTrackIds.length; i++) {
          setTimeout(() => {
            Subscribe2(new Subscribe(new UserId(toTrackIds[i][0], toTrackIds[i][1])));
          }, i * 1000);
        }
      }

      if (requestedTracks && (foundToTrackIds.length < toTrackIds.length)) {
        for (let i = 0; i < toTrackIds.length; i++) {
          var id = myData.find(t => t.userId.m1_1 == toTrackIds[i][0]);
          if (id) {
            foundToTrackIds[i] = foundToTrackIds[i] || {};
            Object.assign(foundToTrackIds[i], id);
          }
        }
      }

      if (requestedTracks) {
        for (let i = 0; i < foundToTrackIds.length; i++) {
          if (!foundToTrackIds[i]) continue;
          foundToTrackIds[i].oldStatus ??= false;
          if (foundToTrackIds[i].onlineStatus.rk1_1 !== foundToTrackIds[i].oldStatus) {
            foundToTrackIds[i].oldStatus = foundToTrackIds[i].onlineStatus.rk1_1;
            sendToDiscord(`everyone:${foundToTrackIds[i].uid} is now ${foundToTrackIds[i].onlineStatus.rk1_1 ? 'online' : 'offline'}`);
          }
        }
      }

      for (let i = 0; i < myData.length; i++) {
        if (!oldBattles[i]) oldBattles[i] = null;
        var currentBattle = myData[i]?.battle || null;
        var prevBattle = oldBattles[i] ? JSON.parse(oldBattles[i]) : null;
        var hasChanged = JSON.stringify(currentBattle) !== oldBattles[i];
        if (hasChanged && updatesThisCycle < maxUpdatesPerCycle) {
          let msg = null;
          if (!currentBattle?.vk0_1?.sk2_1 && prevBattle?.vk0_1?.sk2_1) {
            msg = `${myData[i].uid} has left map ${prevBattle.vk0_1.sk2_1}`;
          } else if (currentBattle?.vk0_1?.sk2_1) {
            var tag = myData[i].clanTag;
            var map = currentBattle.vk0_1.sk2_1;
            var hash = battleIdToHash(currentBattle.vk0_1.qk2_1.toString());
            if (tag && ['AR', 'A.R', 'R8', 'sRev', 'oo', 'KOA', '50-0'].includes(tag)) {
              msg = `everyone:[${tag}] ${myData[i].uid} has joined map ${map} (${hash})`;
            } else {
              msg = `${myData[i].uid} has joined map ${map} (${hash})`;
            }
          }
          if (msg && msg.includes('Halal')) {
            updateBuffer.push(msg);
            updatesThisCycle++;
          }
          oldBattles[i] = JSON.stringify(currentBattle);
        }
      }

      if (updateBuffer.length && now - lastSendTime > sendInterval) {
        updateBuffer.forEach(msg => sendToDiscord(msg));
        updateBuffer = [];
        lastSendTime = now;
      }
    }, 100);

  });
  ready = true;
  console.log('loaded');
  setInterval( async () => {
    console.log('Refreshing page...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 0 });
  }, 40000);
})();

const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));