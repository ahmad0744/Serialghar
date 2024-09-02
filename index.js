const mongoose = require('mongoose');
const uri =  "mongodb+srv://ahmadnehal12023:Zj3aELG3QbCumkNO@trafftarget.zlycyrk.mongodb.net/moviedb?tls=true&authSource=admin";
async function connect() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}
connect();

const express = require('express');
const path = require('path');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 9500;
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const static_path = path.join(__dirname, '/public');
const compression = require('compression');
app.use(compression());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(static_path));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let isFunctionRunning = false;

var allurlmodule = require('./src/model/allurlmod');
let page = "";
let perPage = 42;
app.get('/', async (req, res, next) => {
    var searchcontent = req.query.s;
    if (searchcontent == null || searchcontent == undefined) {
        page = req.query.page || 1;
        try {
            const blog = await allurlmodule.find().skip((perPage * page) - perPage).limit(perPage).sort({ _id: -1 }).exec();
            const count = await allurlmodule.countDocuments({});
            res.render("home", {
                user: blog,
                current: page,
                pages: Math.ceil(count / perPage),
                perPage: perPage,
                count: count,
                cttype: 'all'
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    } else {
        page = req.query.page || 1;
        try {
            var blog = await allurlmodule.find(
                { $text: { $search: searchcontent } },
                { score: { $meta: "textScore" } }
            ).limit(18).sort({ _id: -1 }).exec();
            res.render("home", {
                user: blog,
                current: 1,
                pages: 1,
                perPage: 18,
                count: blog.length,
                cttype: 'all'
            });
        } catch (err) {
            console.error(err);
        }
    }
});

aboutwebsite();
function aboutwebsite() {
    app.get('/page/dmca', (_, resp) => {
        resp.render('pages/dmca');
    });

    app.get('/page/contact', (_, resp) => {
        resp.render('pages/contact');
    });

    app.get('/page/privacy-policy', (_, resp) => {
        resp.render('pages/privacy-policy');
    });

    app.get('/page/terms-and-conditions', (_, resp) => {
        resp.render('pages/terms-and-conditions');
    });
}

var globVar = require('./src/config/glob-variables');
const { errorMonitor } = require('events');
const sendPassMail = (name, email, topic, mssage) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            //service: "gmail",
            auth: {
                user: globVar.yourEmail,
                pass: globVar.yourPass,
            },
        });
        let mailOptions = {
            from: globVar.senderEmail,
            to: 'ahmadnehal99999@gmail.com',
            subject: `${topic}`,
            html: `<h1>Name: ${name}</h1> <br>
            <h3>Email: ${email}</h3> <br>
            <h3>Topic: ${topic}</h3> <br>
            <p>Message: ${mssage}</p> <br>
            <p>from SerialGhar.fun</p> <br>`
        };
        return transporter.sendMail(mailOptions); // promise
    } catch (error) {
        console.log(error.message);
    }
};
app.post('/contact-us', (req, res) => {
    let personInfo = req.body;
    var check_StatusP = sendPassMail(personInfo.namecon.trim(), personInfo.emailcon.trim(), personInfo.topiccon.trim(), personInfo.messagecon.trim());
    if (check_StatusP) {
        res.send({ send: 'Successfully Sent' });
    } else {
        res.send({ send: 'Server Error !' });
    }
});

app.get('/sitemap.xml', async (req, res) => {
    try {
        // Generate sitemap XML
        var topdata = `<?xml version='1.0' encoding='utf-8'?>
        <sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
          <sitemap>
            <loc>https://serialghar.ullu.es/sitemap1.xml</loc>
          </sitemap>
          <sitemap>
            <loc>https://serialghar.ullu.es/sitemap2.xml</loc>
          </sitemap>
          <sitemap>
            <loc>https://serialghar.ullu.es/sitemap3.xml</loc>
          </sitemap>
          <sitemap>
            <loc>https://serialghar.ullu.es/sitemap4.xml</loc>
          </sitemap>
        </sitemapindex>`;
        // Set content type and send the sitemap XML
        res.header('Content-Type', 'application/xml');
        res.send(topdata);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating sitemap');
    }
});

app.get('/sitemap:pageNum.xml', async (req, res) => {
    const pageNum = parseInt(req.params.pageNum);
    const pageSize = 20000;
    const skip = (pageNum - 1) * pageSize;

    try {
        // Fetch data from MongoDB
        const data = await allurlmodule.find({}, 'url updatedAt').skip(skip).limit(pageSize).sort({ _id: -1 }).exec();
        // Generate sitemap XML
        var topdata = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
<loc>https://serialghar.ullu.es</loc>
<lastmod>2023-03-18T22:09:36.990Z</lastmod>
</url>`;
        var bottomdata = `</urlset>`;
        data.forEach(item => {
            topdata += `<url>
            <loc>https://serialghar.ullu.es/${item.url}</loc>
            <lastmod>${item.updatedAt.toISOString()}</lastmod>
            </url>`;
        });
        var finalsitemap = topdata + bottomdata;
        // Set content type and send the sitemap XML
        res.header('Content-Type', 'application/xml');
        res.send(finalsitemap);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating sitemap');
    }
});

app.get("/tag/:tagtype", async (req, res) => {
    var tag = req.params.tagtype;
    var convertedStr = tag.split('-');
    var arrdata = '';
    for (let index = 0; index < convertedStr.length; index++) {
        if (index == convertedStr.length - 1) {
            arrdata += convertedStr[index].charAt(0).toUpperCase() + convertedStr[index].slice(1);
        } else {
            arrdata += convertedStr[index].charAt(0).toUpperCase() + convertedStr[index].slice(1) + ' ';
        }
    }
    const filter = { tag: arrdata };

    page = req.query.page || 1;
    try {
        const blog = await allurlmodule.find(filter).skip((perPage * page) - perPage).limit(perPage).sort({ _id: -1 }).exec();
        const count = await allurlmodule.find(filter).countDocuments({});
        res.render("home", {
            user: blog,
            current: page,
            pages: Math.ceil(count / perPage),
            perPage: perPage,
            count: count,
            cttype: arrdata + '-tag'
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

app.get("/channel/:channeltype", async (req, res) => {
    var channel = req.params.channeltype;
    var convertedStr = channel.replace(/-/g, ' ');
    const filter = { cat: convertedStr };

    page = req.query.page || 1;
    try {
        const blog = await allurlmodule.find(filter).skip((perPage * page) - perPage).limit(perPage).sort({ _id: -1 }).exec();
        const count = await allurlmodule.find(filter).countDocuments({});
        res.render("home", {
            user: blog,
            current: page,
            pages: Math.ceil(count / perPage),
            perPage: perPage,
            count: count,
            cttype: convertedStr + '-channel'
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
})
async function secondupdate(articalurl) {
    let url = `https://serialmaza.online/${articalurl}/`;
    linkarray = [];
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const pCount = $('div.entry p').length;
        for (let index = 0; index < pCount; index++) {
            const ptitle = $(`div.entry p:nth-child(${index + 1}) b span`).text().toLowerCase().replace(/\s+/g, '').trim();
            /*const thirdPText = $('div.entry p:nth-child(3)').text();*/
            if (ptitle == 'vkspeedlink' || ptitle == 'vkspeedlinks' || ptitle == 'vkspeed' || ptitle == 'vkspeedplayerlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'vkspeed', linkurl);
            } else if (ptitle == 'ultrafastlink' || ptitle == 'ultrafastlinks' || ptitle == 'ultrafast' || ptitle == 'ultrafastplayerlink' || ptitle == 'ultrafastplayerlinks') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'ultrafast', linkurl);
            } else if (ptitle == 'okruplayerlinks' || ptitle == 'okruplayerlink' || ptitle == 'okruplayer') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'okru', linkurl);
            } else if (ptitle == 'vkprimelink' || ptitle == 'vkprimelinks' || ptitle == 'vkprime') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'vkprime', linkurl);
            } else if (ptitle == 'flashplayerlink' || ptitle == 'flashlinks' || ptitle == 'flash' || ptitle == 'flashlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'flash', linkurl);
            } else if (ptitle == 'streamhidelink' || ptitle == 'streamhideplayer' || ptitle == 'streamhide' || ptitle == 'streamhideplayerlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'streamhide', linkurl);
            } else if (ptitle == 'multiupdownloadlink' || ptitle == 'multiupdownloadlinks' || ptitle == 'multiupdownload' || ptitle == 'multiup') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'multiupdownload', linkurl);
            }
        }
        if (linkarray.length < 1) {
            const aTags = $('div.entry p a');
            $('div.entry p a').each((index, element) => {
                const ptitle = $(element).text().toLowerCase().replace(/\s+/g, '');
                const elementurl = $(element).attr('href').split('=')[1];
                if (ptitle == 'vkspeedlink' || ptitle == 'vkspeedlinks' || ptitle == 'vkspeed' || ptitle == 'vkspeedplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'vkspeed', linkurl);
                } else if (ptitle == 'ultrafastlink' || ptitle == 'ultrafastlinks' || ptitle == 'ultrafast' || ptitle == 'ultrafastplayerlink' || ptitle == 'ultrafastplayerlinks') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'ultrafast', linkurl);
                } else if (ptitle == 'okruplayerlinks' || ptitle == 'okruplayerlink' || ptitle == 'okruplayer') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'okru', linkurl);
                } else if (ptitle == 'vkprimelink' || ptitle == 'vkprimelinks' || ptitle == 'vkprime' || ptitle == 'vkprimeplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'vkprime', linkurl);
                } else if (ptitle == 'flashplayerlink' || ptitle == 'flashlinks' || ptitle == 'flash' || ptitle == 'flashlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'flash', linkurl);
                } else if (ptitle == 'streamhidelink' || ptitle == 'streamhideplayer' || ptitle == 'streamhide' || ptitle == 'streamhideplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'streamhide', linkurl);
                } else if (ptitle == 'multiupdownloadlink' || ptitle == 'multiupdownloadlinks' || ptitle == 'multiupdownload' || ptitle == 'multiup') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'multiupdownload', linkurl);
                }
            });

        }
        datasubmjson.downlink = linkarray;
        dataupdate(linkarray, articalurl);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
async function dataupdate(linkarray, articalurl) {
    try {
        const result = await allurlmodule.updateOne(
            { url: articalurl },
            { $set: { downlink: linkarray } }
        );
        console.log('Document updated successfully');
    } catch (err) {
        console.error('Error updating document:', err);
    }
}

function setValueWithUniqueKey(jsonObj, baseKey, value) {
    // Check if the baseKey exists
    if (!(baseKey in jsonObj)) {
        jsonObj[baseKey] = value;
        return jsonObj;
    }

    // If the key exists, find the next available key
    let index = 1;
    let newKey = `${baseKey}${index}`;

    while (newKey in jsonObj) {
        index += 1;
        newKey = `${baseKey}${index}`;
    }

    // Set the value with the new unique key
    jsonObj[newKey] = value;
    return jsonObj;
}
const furlall = require('./src/model/furlall');
app.post("/relatedblog", async (req, resp) => {
    var tagda = req.body.tagdata;
    var articalurl = req.body.arturl;
    var uptadestatus = req.body.uptade;
    try {
        const count = await furlall.countDocuments({ type: 'url' });
        const randomNumber = Math.floor(Math.random() * (count - 2 + 1)) + 2;

        const relblog = await allurlmodule.find({ tag: tagda }).limit(6).sort({ _id: -1 }).exec();
        const ezoicurl = await furlall.find({ type: 'url' }, 'url').limit(randomNumber).exec();
        var urlObject = new URL(ezoicurl[randomNumber - 2].url);
        var urlQueryParam = urlObject.searchParams.get('url');
        var parts = urlQueryParam.split('/');
        var filename = parts[parts.length - 1].replace('NEHALCHANGE', '');

        resp.send({ relatdata: relblog, uniqueurl: [ezoicurl[randomNumber - 1].url, filename]});
        await allurlmodule.updateOne({ url: articalurl }, { $inc: { views: 1 } });
        // secondscrap to update
        if(uptadestatus == 'yesupdate'){
            secondupdate(articalurl);
        }
    } catch (err) {
        console.error(err);
    }
})
app.get('/:linkhere', async (req, resp) => {
    var inputString = req.params.linkhere;
    try {
        const blog = await allurlmodule.findOne({ url: inputString }).exec();
        if (blog == null) {
            resp.status(404).render('404');
        } else {
            resp.render("display", { user: blog });
        }

    } catch (err) {
        console.log('error')
    }
});

function autotrigger() {
    let url = `https://serialmaza.online/`;
    if (!isFunctionRunning) {
        isFunctionRunning = true;
        triggerFunction(url)
            .then(() => {
                datasubmjson = {};
                console.log('All done completed');
            })
            .catch((error) => {
                datasubmjson = {}; 
            });
    } else {
        resp.send({ result: 'Function is already running' });
    }
}
var runnumber = 1;
const yourHourlyFunction = () => {
    console.log(`Run ${runnumber} times.`);
    autotrigger();
    runnumber++;
};
cron.schedule('*/10 * * * *', yourHourlyFunction);
var dataarray = [];
async function triggerFunction(url) {
    dataarray = [];
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('.cat-box-content .recent-item').each((index, element) => {
            const div = $(element);
            const anchor = div.find('a');
            const img = div.find('img');
            const heading = div.find('h3');
            // Extract href, src attributes, and text content
            const href = anchor.attr('href');
            const src = img.attr('src');
            const text = heading.text();

            dataarray.push({ title: text, url: href, image: src });
        });
        await databasecheck(dataarray);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
    isFunctionRunning = false;
}
async function databasecheck(dataarray) {
    const regex = /\/([^/]+)\/$/;
    for (let index = dataarray.length - 1; index >= 0; index--) {
        const urldata = dataarray[index].url.trim();
        const imgdata = dataarray[index].image.trim();
        const titledata = dataarray[index].title.trim();
        const match = urldata.match(regex);
        const exacturldata = match && match[1];

        try {
            const blog = await allurlmodule.findOne({ url: exacturldata }).exec();
            if (blog == null) {
               await secondscrapping(imgdata, titledata, exacturldata, index);
            }
        } catch (err) {
            continue; // Skip to the next iteration
        }
    }
}
var linkarray = {};
async function secondscrapping(imgdata, titledata, exacturldata, childcou) {
    let url = `https://serialmaza.online/${exacturldata}/`;
    //let url = `https://serialmaza.online/khatron-ke-khiladi-14-31st-august-2024-episode-11/`;
    datasubmjson.title = titledata;
    datasubmjson.url = exacturldata;
    datasubmjson.image = imgdata;
    datasubmjson.views = '0';
    linkarray = {};
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const tagserialname = $('.post-cats').text();
        const catg = $('.post-cats a').attr('href');
        const regex = /\/category\/([^/]+)\//;
        const match = catg.match(regex);
        const finalcat = match && match[1];

        datasubmjson.tag = tagserialname;
        datasubmjson.cat = finalcat.replace(/-/g, ' ');

        const pCount = $('div.entry p').length;
        for (let index = 0; index < pCount; index++) {
            const ptitle = $(`div.entry p:nth-child(${index + 1}) b span`).text().toLowerCase().replace(/\s+/g, '').trim();
            /*const thirdPText = $('div.entry p:nth-child(3)').text();*/
            if (ptitle == 'vkspeedlink' || ptitle == 'vkspeedlinks' || ptitle == 'vkspeed' || ptitle == 'vkspeedplayerlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'vkspeed', linkurl);
            } else if (ptitle == 'ultrafastlink' || ptitle == 'ultrafastlinks' || ptitle == 'ultrafast' || ptitle == 'ultrafastplayerlink' || ptitle == 'ultrafastplayerlinks') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'ultrafast', linkurl);
            } else if (ptitle == 'okruplayerlinks' || ptitle == 'okruplayerlink' || ptitle == 'okruplayer') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'okru', linkurl);
            } else if (ptitle == 'vkprimelink' || ptitle == 'vkprimelinks' || ptitle == 'vkprime' || ptitle == 'vkprimeplayerlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'vkprime', linkurl);
            } else if (ptitle == 'flashplayerlink' || ptitle == 'flashlinks' || ptitle == 'flash' || ptitle == 'flashlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                linkarray['flash'] = linkurl;
                setValueWithUniqueKey(linkarray, 'flash', linkurl);
            } else if (ptitle == 'streamhidelink' || ptitle == 'streamhideplayer' || ptitle == 'streamhide' || ptitle == 'streamhideplayerlink') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'streamhide', linkurl);
            } else if (ptitle == 'multiupdownloadlink' || ptitle == 'multiupdownloadlinks' || ptitle == 'multiupdownload' || ptitle == 'multiup') {
                index++;
                var linkurl = [];
                const atagcount = $(`div.entry p:nth-child(${index + 1})`).find('a');
                for (let i = 0; i < atagcount.length; i++) {
                    const element = $(atagcount[i]).attr('href').split('=')[1];
                    linkurl.push(element);
                }
                setValueWithUniqueKey(linkarray, 'multiupdownload', linkurl);
            }
        }
        if (Object.keys(linkarray).length < 1) {
            const aTags = $('div.entry p a');
            $('div.entry p a').each((index, element) => {
                const ptitle = $(element).text().toLowerCase().replace(/\s+/g, '');
                const elementurl = $(element).attr('href').split('=')[1];
                if (ptitle == 'vkspeedlink' || ptitle == 'vkspeedlinks' || ptitle == 'vkspeed' || ptitle == 'vkspeedplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'vkspeed', linkurl);
                } else if (ptitle == 'ultrafastlink' || ptitle == 'ultrafastlinks' || ptitle == 'ultrafast' || ptitle == 'ultrafastplayerlink' || ptitle == 'ultrafastplayerlinks') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'ultrafast', linkurl);
                } else if (ptitle == 'okruplayerlinks' || ptitle == 'okruplayerlink' || ptitle == 'okruplayer') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'okru', linkurl);
                } else if (ptitle == 'vkprimelink' || ptitle == 'vkprimelinks' || ptitle == 'vkprime' || ptitle == 'vkprimeplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'vkprime', linkurl);
                } else if (ptitle == 'flashplayerlink' || ptitle == 'flashlinks' || ptitle == 'flash' || ptitle == 'flashlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'flash', linkurl);
                } else if (ptitle == 'streamhidelink' || ptitle == 'streamhideplayer' || ptitle == 'streamhide' || ptitle == 'streamhideplayerlink') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'streamhide', linkurl);
                } else if (ptitle == 'multiupdownloadlink' || ptitle == 'multiupdownloadlinks' || ptitle == 'multiupdownload' || ptitle == 'multiup') {
                    var linkurl = [];
                    linkurl.push(elementurl);
                    setValueWithUniqueKey(linkarray, 'multiupdownload', linkurl);
                }
            });

        }
        datasubmjson.downlink = linkarray;
        datasubmitdb(datasubmjson, childcou);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
async function datasubmitdb(datasubmjson, childcou) {
    let alldata = new allurlmodule(datasubmjson);
    alldata.save()
        .then((savedMovie) => {
            datasubmjson = {};
            console.log('Success--' + childcou);
        })
        .catch((err) => {
            datasubmjson = {};
            console.log('error');
        });
}

// 404 Error Handling Middleware
app.use(function (_, res) {
    res.status(404).render('404');
});

app.listen(port);
