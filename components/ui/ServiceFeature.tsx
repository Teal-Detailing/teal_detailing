interface ServiceFeatureProps {
  iconPath: string
  title: string
  description: string
}

export default function ServiceFeature({ iconPath, title, description }: ServiceFeatureProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-slate-100">
      <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={iconPath} />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
        <p className="text-slate-600 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
