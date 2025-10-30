import React, { useEffect, useRef, useState } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { getPlanes } from "../../services/planes"
import type { Plan } from "../../interfaces/planes"

const Planes: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getPlanes()
        setPlanes(Array.isArray(data) ? data : [])
      } catch (e: any) {
        setError("No se pudieron cargar los planes.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!planes.length) return
    if (isHover) {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = window.setInterval(() => {
      handleNext()
    }, 4500)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [planes, isHover])

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(parseFloat(price))

  const handleNext = () => {
    if (!planes.length) return
    setFading(true)
    window.setTimeout(() => {
      setCurrent((prev) => (prev + 1) % planes.length)
      setFading(false)
    }, 180)
  }

  const handlePrev = () => {
    if (!planes.length) return
    setFading(true)
    window.setTimeout(() => {
      setCurrent((prev) => (prev - 1 + planes.length) % planes.length)
      setFading(false)
    }, 180)
  }

  return (
    <>
      <section id="planes" className="relative py-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-sky-300 to-transparent" />

        <div className="max-w-7xl mx-auto text-center mb-14" data-aos="fade-up">
          <h2 className="text-4xl font-bold tracking-tight text-slate-800">Planes</h2>
          <p className="text-slate-600 mt-3 text-lg">Escoge el plan que más te guste y cubra tus necesidades.</p>
        </div>

        <div className="max-w-7xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div
              className="relative max-w-3xl mx-auto"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {planes.length > 0 && (
                <div
                  key={planes[current]?.idPlan ?? current}
                  className={`group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_10px_25px_-10px_rgba(0,0,0,0.18)] ring-1 ring-slate-200 transition-all duration-300 ${
                    fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                  }`}
                >
                  <div className="absolute -top-24 right-[-40px] h-48 w-48 rounded-full blur-3xl opacity-20 bg-sky-300" />

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">
                        {planes[current].tipoPlan}
                      </h3>
                    </div>
                    <div className="mt-3 mb-4 flex items-end gap-2">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                        {formatPrice(planes[current].precio)}
                      </span>
                      <span className="text-sm text-slate-500 mb-1">/ mensual</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{planes[current].descripcion}</p>
                  </div>

                  <div className="px-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  </div>

                  <div className="p-6 pt-5">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Incluye</h4>
                    <ul className="text-slate-600 space-y-2">
                      {Array.isArray(planes[current].planXBeneficios) && planes[current].planXBeneficios.length > 0 ? (
                        planes[current].planXBeneficios.slice(0, 6).map((b: any, i: number) => (
                          <li key={`${planes[current].idPlan}-${i}`} className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
                              <FaCheckCircle className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-sm">{b.beneficio?.tipoBeneficio ?? b.beneficio?.tipo_beneficio ?? "Beneficio"}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-3 text-slate-500 italic">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
                            <FaCheckCircle className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-sm">Sin beneficios asignados</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <button
                aria-label="Anterior"
                onClick={handlePrev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-200 text-sky-700 shadow hover:bg-white transition"
              >
                <HiChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={handleNext}
                className="absolute -right-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-200 text-sky-700 shadow hover:bg-white transition"
              >
                <HiChevronRight className="h-6 w-6" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                {planes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === current ? "w-6 bg-blue-600" : "w-2.5 bg-sky-300/70 hover:bg-sky-400"
                    }`}
                    aria-label={`Ir al plan ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Planes
