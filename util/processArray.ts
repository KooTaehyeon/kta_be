export const processArrayData = (data: string | string[]): string[] => {
  return typeof data === 'string' ? data.split(',') : data || [];
};
