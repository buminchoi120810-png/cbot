const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1476972158772187239";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  console.log(`로그인됨: ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("💳 금액 충전")
    .setDescription("아래 버튼을 눌러 충전을 진행하세요.")
    .setColor(0x3498db);

  const button = new ButtonBuilder()
    .setCustomId("charge_button")
    .setLabel("💰 금액 충전하기")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({ embeds: [embed], components: [row] });
});

client.on(Events.InteractionCreate, async interaction => {
  // 🔘 버튼 클릭
  if (interaction.isButton() && interaction.customId === "charge_button") {
    const modal = new ModalBuilder()
      .setCustomId("deposit_modal")
      .setTitle("금액 충전");

    const nameInput = new TextInputBuilder()
      .setCustomId("depositor_name")
      .setLabel("입금자명을 입력해주세요")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  // 📝 모달 제출
  if (interaction.isModalSubmit() && interaction.customId === "deposit_modal") {
    const depositor = interaction.fields.getTextInputValue("depositor_name");

    const resultEmbed = new EmbedBuilder()
      .setTitle("❌ 충전 실패")
      .setDescription("입금내역을 찾을 수 없습니다.")
      .setColor(0xe74c3c);

    await interaction.reply({
      embeds: [resultEmbed],
      ephemeral: true
    });
  }
});

client.login(TOKEN);
