import got from 'got'
import * as cheerio from 'cheerio'
import FormData from 'form-data'
import { SnapSave, SnapSaveArgsSchema, SnapSaveSchema } from '../types/snapsave.js'
import { DEFAULT_HEADERS } from './constant.js'
import { decryptSnapSave } from './util.js'

export default async function snapsave(url: string) {
    SnapSaveArgsSchema.parse(arguments)

    const form = new FormData()
    form.append('url', url)

    const code = await got.post('https://snapsave.app/action.php?lang=en', {
        headers: {
            ...DEFAULT_HEADERS,
            ...form.getHeaders(),
            origin: 'https://snapsave.app',
            referer: 'https://snapsave.app/en'
        },
        body: form.getBuffer()
    }).text()

    const decode = decryptSnapSave(code)
    const $ = cheerio.load(decode)
    const results: (SnapSave['results'][number] & { shouldRender?: boolean })[] = []

    const title = $('.content > p > strong').text() || undefined
    const description = $('span.video-des').text() || undefined

    if ($('div.download-items').length) {
        $('div.download-items').each((_, el) => {
            const $el = $(el)
            const url = $el.find('.download-items__btn > a').attr('href')!
            const thumbUrl = new URL($el.find('.download-items__thumb > img').attr('src')!)
            const thumb = thumbUrl.searchParams.get('photo') || thumbUrl.toString()
            results.push({
                thumbnail: thumb,
                url
            })
        })
    } else if ($('table.table').length) {
        const thumbnail = $('figure > .image > img').attr('src') || undefined
        $('tbody > tr').each((_, el) => {
            const $el = $(el)
            const $td = $el.find('td')
            const resolution = $td.eq(0).text()
            let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
            const shouldRender = /get_progressApi/ig.test(_url || '')
            if (shouldRender) {
                _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
            }
            results.push({
                resolution,
                thumbnail,
                url: _url!,
                shouldRender
            })
        })
    } else {
        const thumbnail = $('figure > .image > img').attr('src')!
        const url = $('div.column > a').attr('href')!
        results.push({
            thumbnail,
            url
        })
    }

    const result = {
        title,
        description,
        results
    }

    return SnapSaveSchema.parse(result)
}