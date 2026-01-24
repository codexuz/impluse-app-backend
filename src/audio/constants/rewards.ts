export const REWARDS = {
  VIDEO_UPLOAD: { coins: 15, points: 25 },
  LIKE: { coins: 1, points: 2 },
  COMMENT: { coins: 2, points: 4 },
  JUDGE: { coins: 5, points: 10 },
};

export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  JUDGE = "JUDGE",
  VIDEO_UPLOAD = "VIDEO_UPLOAD",
}
