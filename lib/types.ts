export interface Stage {
  id: string;
  num: string;
  number?: string;
  slug: string;
  title: string;
  subtitle: string;
  weeks: string;
  color: string;
  accentBg: string;
  tint?: string;
  deep?: string;
  description: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadUrl?: string;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  filmNumber: number;
  title: string;
  description: string;
  stageId: string;
  stageTitle: string;
  stageColor: string;
  cloudflareUid: string;
  durationSeconds: number;
  durationFormatted: string;
  thumbnailUrl: string;
  isFreePreview: boolean;
  attachments: Attachment[];
}

export interface CourseCatalog {
  stages: Stage[];
  lessons: Lesson[];
}

export type UserRole = 'guest' | 'student' | 'partner';

export interface MedicineCabinetItem {
  id: string;
  tag: string;
  title: string;
  category: string;
  stageId: string;
  lessonId: string;
  previewText: string;
}
