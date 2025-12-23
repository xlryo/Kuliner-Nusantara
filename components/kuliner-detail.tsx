"use client"

import { useState, useEffect } from "react"
import Gallery from "./gallery"
import BookmarkButton from "./bookmark-button"
import RatingStars from "./rating-stars"
import { AccordionItem } from "./accordion"
import { Copy } from "lucide-react"
import kulinerData from "@/data/kuliner-data.json"

interface KulinerDetailProps {
  data?: any
}

export default function KulinerDetail({ data }: KulinerDetailProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [avgRating, setAvgRating] = useState(0)

  // fallback to sample data if no props provided
  const detail: any = data || (kulinerData as any)

  // compute average rating from localStorage reviews
  useEffect(() => {
    // default rating from data
    let baseRating = detail?.rating_rata_rata || 0
    let computed = baseRating
    if (typeof window !== "undefined") {
      try {
        const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
        const currentReviews = allReviews[detail.id] || []
        if (currentReviews.length > 0) {
          const total = currentReviews.reduce((sum: number, r: any) => sum + r.rating, 0)
          computed = total / currentReviews.length
        }
      } catch (err) {
        // ignore parse errors
      }
    }
    setAvgRating(computed)
  }, [detail?.id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <article className="container mx-auto px-5 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Kolom Kiri: Gallery */}
        <div className="flex-1">
          <Gallery images={detail.gallery} />
        </div>

        {/* Kolom Kanan: Info */}
        <div className="flex-1 lg:flex-[1.2]">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-serif text-5xl m-0 text-[#A64029]">{detail.nama}</h1>
            <div className="text-[#6E5849] font-medium my-2.5">
              {detail.daerah} | {detail.kategori}
            </div>
          <div className="flex items-center gap-4 my-5">
              {/* Display average rating including user reviews */}
              <RatingStars rating={Math.round(avgRating)} />
              <span className="bg-[#E2903A] text-white px-4 py-1.5 rounded-full font-medium text-sm">{detail.harga}</span>
            </div>
            <BookmarkButton kulinerId={detail.id} />
          </header>

          {/* Deskripsi */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-2">Ringkasan</h2>
            <p className="text-[#6E5849] leading-relaxed">{detail.deskripsi.ringkas}</p>
            {isDescriptionExpanded && (
              <p className="text-[#6E5849] leading-relaxed mt-4 whitespace-pre-wrap">{detail.deskripsi.lengkap}</p>
            )}
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="bg-none border-none text-[#A64029] font-bold cursor-pointer p-0 mt-2"
            >
              {isDescriptionExpanded ? "Tampilkan Lebih Sedikit" : "Baca Selengkapnya"}
            </button>
          </section>

          {/* Resep */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-4">Resep</h2>
            <div className="space-y-2">
              <AccordionItem title="Bahan-bahan">
                <ul className="list-disc list-inside space-y-2 text-[#6E5849]">
                  {detail.resep.bahan.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Langkah Memasak">
                <ol className="list-decimal list-inside space-y-2 text-[#6E5849]">
                  {detail.resep.langkah.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </AccordionItem>
            </div>
          </section>

          {/* Bagikan */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-4">Bagikan</h2>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#ccc] rounded-lg font-medium cursor-pointer hover:bg-[#eee] transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? "Link Disalin!" : "Salin Link"}
            </button>
          </section>
        </div>
      </div>
    </article>
  )
}
