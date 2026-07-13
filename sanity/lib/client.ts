import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// ➔ 🔍 Data කියවන්න විතරක් පාවිච්චි කරන පරණ Client එක
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
})

// ➔ 🎯 POS එකෙන් ඩේටා ලියන්න සහ Stock අඩු කරන්න පාවිච්චි කරන අලුත් Client එක
export const writeClient = createClient({
  projectId, // 👈 අර උඩින් import කරපු variable එකම දැම්මා
  dataset,   // 👈 මේකත් එහෙමයි
  apiVersion: '2024-01-01', // Write operations වලට static version එකක් තැබීම හොඳයි
  useCdn: false, // ⚠️ Live Write කරන නිසා අනිවාර්යයෙන්ම false විය යුතුයි
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, // 🌟 .env.local එකේ තියෙන Token එක
})