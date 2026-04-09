import axios from 'axios';
import * as cheerio from 'cheerio';
import { insertJob } from './db';

export async function scrapeSarkariResult() {
  try {
    const { data } = await axios.get('https://www.sarkariresult.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(data);

    // SarkariResult has different boxes for Results, Admit Cards, Latest Jobs
    const categories = [
      { id: '#result', name: 'Result' },
      { id: '#admitcard', name: 'Admit Card' },
      { id: '#latestjob', name: 'Job' }
    ];

    for (const cat of categories) {
      $(cat.id).find('ul li a').each((_, el) => {
        const title = $(el).text().trim();
        let link = $(el).attr('href');
        
        if (title && link) {
          if (!link.startsWith('http')) {
            link = 'https://www.sarkariresult.com' + link;
          }
          
          insertJob({
            title,
            category: cat.name,
            applyLink: link,
            sourceWebsite: 'SarkariResult',
          });
        }
      });
    }
  } catch (error) {
    console.error('Error scraping SarkariResult:', error);
  }
}

export async function scrapeFreeJobAlert() {
  try {
    const { data } = await axios.get('https://www.freejobalert.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(data);

    // FreeJobAlert structure (simplified)
    $('.lates-announ-table tr').each((_, el) => {
      const title = $(el).find('td:nth-child(2) a').text().trim();
      const link = $(el).find('td:nth-child(2) a').attr('href');
      const lastDate = $(el).find('td:nth-child(3)').text().trim();

      if (title && link) {
        insertJob({
          title,
          category: 'Job',
          lastDate,
          applyLink: link,
          sourceWebsite: 'FreeJobAlert',
        });
      }
    });
  } catch (error) {
    console.error('Error scraping FreeJobAlert:', error);
  }
}

export async function scrapeJobs() {
  await scrapeSarkariResult();
  await scrapeFreeJobAlert();
}
