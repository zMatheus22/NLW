import { PrismaClient } from "@prisma/client";
import  express from "express";
import cors from 'cors';
import {convertHourStringToMinutes} from './utils/convert-hour-string-to-minutes'
import {convertMinutesStringToHour} from './utils/convert-minutes-string-to-hour'

const PORT = 3333;
const app = express();
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.post("/games/:id/ads", async (req, res)=>{
    const gameId = req.params.id;
    const body: any = req.body;

    const ad = await prisma.ad.create({
        data: {
            gameId: gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return res.json(ad)
})

app.get("/games", async (req, res)=>{
    const games = await prisma.game.findMany({
        include: {
            _count:{
                select:{
                    ads: true
                }
            }
        }
    })

    return res.json(games)
})

app.get("/games/:id/ads", async(req, res) =>{
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            yearsPlaying: true,
            weekDays: true,
            hourStart: true,
            hourEnd: true,
            useVoiceChannel: true,
        },
        where:{
            gameId,
        }, 
        orderBy:{
            createdAt: "asc"
        }
    })

    return res.json(ads.map(ad=>{
       return{
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesStringToHour(ad.hourStart),
        hourEnd: convertMinutesStringToHour(ad.hourEnd)
       } 
    }))
})

app.get("/ads/:id/discord", async (req, res)=>{
    const adId = req.params.id;

    const ad = await prisma.ad.findFirstOrThrow({
        select:{
            discord: true
        },
        where:{
           id: adId,
        }
    })
    return res.json({
        discord: ad.discord,
    })
})

app.listen(PORT);