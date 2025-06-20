import got from 'got';
import * as cheerio from 'cheerio';
import FormData from 'form-data';

export default async function snapsave(url: string) {
  const form = new FormData();
  form.append('url', url);

  const response = await got.post('https://snapsave.app/action.php?lang=en', {
    headers: {
      ...form.getHeaders(),
      origin: 'https://snapsave.app',
      referer: 'https://snapsave.app/en',
    },
    body: form,
  });

  const html = response.body;
  const $ = cheerio.load(html);

  const results = [];
  const title = $('.content > p > strong').text() || undefined;
  const description = $('span.video-des').text() || undefined;

  if ($('div.download-items').length > 0) {
    $('div.download-items').each((_, el) => {
      const $el = $(el);
      const link = $el.find('.download-items__btn > a').attr('href');
      const thumb = $el.find('.download-items__thumb > img').attr('src');
      if (link) {
        results.push({ url: link, thumbnail: thumb });
      }
    });
  } else if ($('table.table').length > 0) {
    const thumbnail = $('figure > .image > img').attr('src');
    $('tbody > tr').each((_, el) => {
      const $el = $(el);
      const quality = $el.find('td').eq(0).text().trim();
      const link = $el.find('td').eq(2).find('a').attr('href');
      if (link) {
        results.push({ resolution: quality, url: link, thumbnail });
      }
    });
  }

  return { title, description, results };
}
