export enum ResponseMode {
  CONCISE = 'concise',
  NORMAL = 'normal',
  DETAILED = 'detailed'
}

export const MODE_PROMPTS: Record<ResponseMode, string> = {
  [ResponseMode.CONCISE]: 'Answer in maximum 2-3 sentences. Be direct.',
  [ResponseMode.NORMAL]: 'Answer in about 1 paragraph. Be clear and concise.',
  [ResponseMode.DETAILED]: 'Provide a complete and detailed explanation.'
};
