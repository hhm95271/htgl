import $ from '@/plugins/js/axios.config';

export const getReports = (type) => {
  return $({
    url: `reports/type/${type}`,
  });
};
