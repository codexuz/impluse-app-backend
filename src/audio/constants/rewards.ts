export const REWARDS = {
  VIDEO_UPLOAD: { coins: 2, points: 5 },
  LIKE: { coins: 1, points: 2 },
  COMMENT: { coins: 1, points: 2 },
  JUDGE: { coins: 1, points: 1 },
};

export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  JUDGE = "JUDGE",
  VIDEO_UPLOAD = "VIDEO_UPLOAD",
}
