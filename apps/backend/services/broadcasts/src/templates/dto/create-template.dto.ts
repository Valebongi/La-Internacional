export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

export interface TemplateButton {
  type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY';
  text: string;
  url?: string;
  phone_number?: string;
}

export interface TemplateComponentDto {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    body_text?: string[][];
    header_text?: string[];
  };
  buttons?: TemplateButton[];
}

export interface CreateTemplateDto {
  name: string;
  category: TemplateCategory;
  language: string;
  components: TemplateComponentDto[];
}
