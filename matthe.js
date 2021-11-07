const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const request = require('request');
let Options = {
    "Vanity_URL": "URL ORNEK (discord.gg/xxx ise sadece xxx yazın)",
    "Log_Channel": "URL TETİKLENDİĞİNDE MESAJ ATILAN LOG KANAL ID",
    "Bot_Token": "BOT TOKENİNİZ"
}
client.on('guildUpdate', async (oldGuild, newGuild) => {
    ;
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
    let entry = await newGuild.fetchAuditLogs({
        type: 'GUILD_UPDATE'
    }).then(audit => audit.entries.first());
    if (!entry.executor || entry.executor.id === client.user.id) return;
    let channel = client.channels.cache.get(Options.Log_Channel);
    newGuild.members.ban(entry.executor.id, {
        reason: `${entry.executor.tag} kullanıcısı url'yi değiştirmeye çalıştığı için yasaklandı!`
    });
    if (channel) channel.send(new MessageEmbed().setColor("2F3136").setTimestamp().setDescription(`${entry.executor} kullanıcısı url'yi değiştirmeye çalıştığı için yasaklandı ve url eski haline getirildi.`))
    if (!channel) newGuild.owner.send(new MessageEmbed().setColor("2F3136").setTimestamp().setDescription(`${entry.executor} kullanıcısı url'yi değiştirmeye çalıştığı için yasaklandı ve url eski haline getirildi.`))
    
    const settings = {
        url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
        body: { code: Options.Vanity_URL },
        json: true,
        method: 'PATCH',
        headers: { "Authorization": `Bot ${Options.Bot_Token}` }
    };
    request(settings, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
});

client.login(Options.Bot_Token).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));




