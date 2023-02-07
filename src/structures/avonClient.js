const { Client , GatewayIntentBits , Collection , WebhookClient, Partials , EmbedBuilder } = require(`discord.js`);
const { Guilds , MessageContent , GuildInvites , GuildVoiceStates , GuildMessages , DirectMessages } = GatewayIntentBits;
const { User , Channel , Reaction , Message , GuildMember } = Partials;
const { Poru } = require(`poru`);
const { errors } = require(`../../config.json`);
const { Database } = require("quickmongo");
const AvonEvents = require("./avonEvents");
const AvonCommands = require("./CommandHandler");
const { Spotify } = require("poru-spotify");
const config = require(`../../config.json`);
const web = new WebhookClient({url : errors});
class Avon extends Client {
    constructor(){
        super({
            intents : [Guilds,MessageContent,GuildInvites,GuildMessages,DirectMessages,GuildVoiceStates],
            partials : [Channel,User,Reaction,Message,GuildMember],
            allowedMentions : {
                repliedUser : true,
                parse : ['everyone','roles','users']
            }
        });
        this.poru = new Poru(this,config.nodes,{
            plugins : [new Spotify({clientID : config.spotifyID,clientSecret : config.spotifySecret, playlistLimit : 5})],
        });
        this.data = new Database(config.mongourl);
        this.data.connect();
        this.emoji = require(`${process.cwd()}/emoji.json`);
        this.config = require(`${process.cwd()}/config.json`);
        this.AvonCommands = new AvonCommands(this).loadCommands();
        this.events = new AvonEvents(this).loadEvents();
        this.login(this.config.token);
    }
    
}
module.exports = Avon;
