import take from "lodash/take";
import shuffle from "lodash/shuffle";

const generateNickname = () => {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  return take(shuffle(possible), 6).join("");
};

export default generateNickname;
