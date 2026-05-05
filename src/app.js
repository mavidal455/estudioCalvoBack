import express from "express"
import dotenv from 'dotenv';
import resend from './routes/resendRoutes.js'
import cors from 'cors'
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app= express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const corsOptions = {
  origin: 'http://localhost:3001',  
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(helmet());

// Then apply your routes
app.use(resend)

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes. Probá más tarde."
  }
});

app.use('/resend', mailLimiter);
app.use('/resend', resend);

export default app;