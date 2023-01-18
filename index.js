const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();
const express = require("express");
const db = require("quick.db");

const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

bot.on('guildMemberAdd', async (member) => {
  member.roles.add("").catch(e => console.error(e));
}); //entre as "" voce bota o id do cargo para quando algum membro entrar o bot setar


//mençao bot

bot.on("message", msg => {
  if (msg.content === `<@${bot.user.id}>`)
    msg.channel.send("digite z!ajuda para meus comandos")
}) //entre os "" basta colocar oque voce quiser quando algum mencionar o bot

bot.on("message", msg => {
  if (msg.content === `<@!${bot.user.id}>`)
    msg.channel.send("digite z!ajuda para meus comandos")
}); //entre os "" basta colocar oque voce quiser quando algum mencionar o bot


bot.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type == 'channel') return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)) return;

  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)//puxando a pasta comands + o comando
    commandFile.run(bot, message, args);
  } catch (err) {
    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`${message.author},`)
    return message.channel.send(embed);
  }
});

//status
bot.on('ready', () => {
  console.log('Estou online');
  var tabela = [
    { name: '', type: 'LISTENING' },
    { name: '', type: 'WATCHING' }
  ]; //entre os "" bote oque voces querem na atividade do discord do bot

  function setStatus() {
    var altstatus = tabela[Math.floor(Math.random() * tabela.length)]
    bot.user.setActivity(altstatus)
  }
  setStatus("dnd")
  setInterval(() => setStatus(), 5000)
})

//set de menssagens delete

bot.on("messageDelete", async (message) => {

  let ferinha_canal = db.get(`ferinha_msg_del_${message.guild.id}`);
  if (!ferinha_canal === null) return;

  if (message.author.bot) return;

  let ferinha_author = message.author;
  let ferinha_canal_2 = message.channel;
  let ferinha_msg_del = message.content;

  let ferinha_msg_embed = new Discord.MessageEmbed()
    .setTitle(`🗑 Mensagem excluída`)
    .setColor("RANDOM")
    .addFields(
      {
        name: `Autor da mensagem`,
        value: ferinha_author,
        inline: false
      },
      {
        name: `Canal`,
        value: ferinha_canal_2,
        inline: false
      },
      {
        name: `Mensagem`,
        value: `\`\`\`${ferinha_msg_del}\`\`\``,
        inline: false
      }
    )
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter(message.guild.name, message.guild.iconURL());

  bot.channels.cache.get(ferinha_canal).send(ferinha_msg_embed)
});


bot.login(config.token);