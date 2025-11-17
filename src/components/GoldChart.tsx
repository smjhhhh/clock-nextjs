'use client'

export default function GoldChart() {
  return (
    <div className="rounded overflow-hidden">
      <iframe
        src="https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=OANDA%3AXAUUSD&interval=D&theme=dark&style=2&locale=zh_CN&colorTheme=dark&isTransparent=false&autosize=false&width=100%25&height=220"
        className="w-full h-56"
        title="Gold Price Chart"
        style={{ border: 'none' }}
      />
    </div>
  )
}
