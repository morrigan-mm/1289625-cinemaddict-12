export const createEmojiTemplate = (emoji, size) => {
  return (
    `<img src="./images/emoji/${emoji}.png" width="${size}" height="${size}" alt="emoji-${emoji}">`
  );
};
