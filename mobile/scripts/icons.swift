// Genera los iconos de la app: una lámpara ámbar encendida con la letra E, dentro de un aro de latón.
// Uso: swift scripts/icons.swift  (desde mobile/)
import AppKit
import CoreText

let fontURL = URL(fileURLWithPath: "node_modules/@expo-google-fonts/big-shoulders-stencil-display/BigShouldersStencilDisplay_800ExtraBold.ttf")
let stencil = (CTFontManagerCreateFontDescriptorsFromURL(fontURL as CFURL) as! [CTFontDescriptor])[0]

func rgb(_ hex: UInt32, _ a: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255, green: CGFloat((hex >> 8) & 255) / 255, blue: CGFloat(hex & 255) / 255, alpha: a)
}

enum Style { case full, foreground, background, mono, splash }

func render(_ size: Int, _ style: Style, _ path: String) {
  let s = CGFloat(size)
  // El icono de iOS no puede tener canal alfa; los de Android y el splash sí lo necesitan.
  let opaque = style == .full || style == .background
  let ctx = CGContext(data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(),
                      bitmapInfo: (opaque ? CGImageAlphaInfo.noneSkipLast : CGImageAlphaInfo.premultipliedLast).rawValue)!
  let space = CGColorSpaceCreateDeviceRGB()
  let c = CGPoint(x: s / 2, y: s / 2)

  if style == .full || style == .background {
    let g = CGGradient(colorsSpace: space, colors: [rgb(0x2a2b30), rgb(0x0c0d0e)] as CFArray, locations: [0, 1])!
    ctx.drawRadialGradient(g, startCenter: c, startRadius: 0, endCenter: c, endRadius: s * 0.75, options: .drawsAfterEndLocation)
  }
  if style == .background { return save(ctx, path) }

  // Escala del dibujo: el icono completo ocupa casi todo; el de Android y el splash dejan margen de seguridad.
  let k: CGFloat = style == .full ? 1 : (style == .splash ? 0.92 : 0.62)
  let ringR = s * 0.335 * k, lampR = s * 0.29 * k

  if style == .mono {
    ctx.setStrokeColor(rgb(0xffffff)); ctx.setLineWidth(s * 0.03 * k)
    ctx.strokeEllipse(in: CGRect(x: c.x - ringR, y: c.y - ringR, width: ringR * 2, height: ringR * 2))
  } else {
    // Halo de la lámpara encendida
    let halo = CGGradient(colorsSpace: space, colors: [rgb(0xffb43c, 0.55), rgb(0xffb43c, 0)] as CFArray, locations: [0, 1])!
    ctx.drawRadialGradient(halo, startCenter: c, startRadius: lampR * 0.9, endCenter: c, endRadius: ringR * 1.45, options: [])
    // Aro de latón
    ctx.setStrokeColor(rgb(0xc79f55)); ctx.setLineWidth(s * 0.032 * k)
    ctx.strokeEllipse(in: CGRect(x: c.x - ringR, y: c.y - ringR, width: ringR * 2, height: ringR * 2))
    // Cristal de la lámpara
    ctx.saveGState()
    ctx.addEllipse(in: CGRect(x: c.x - lampR, y: c.y - lampR, width: lampR * 2, height: lampR * 2)); ctx.clip()
    let glass = CGGradient(colorsSpace: space, colors: [rgb(0xfff6d8), rgb(0xffb43c), rgb(0xc06a10)] as CFArray, locations: [0, 0.5, 1])!
    let hi = CGPoint(x: c.x, y: c.y + lampR * 0.12)
    ctx.drawRadialGradient(glass, startCenter: hi, startRadius: 0, endCenter: c, endRadius: lampR, options: .drawsAfterEndLocation)
    ctx.restoreGState()
  }

  // Letra E
  let font = CTFontCreateWithFontDescriptor(stencil, lampR * 1.55, nil)
  let color = style == .mono ? rgb(0xffffff) : rgb(0x2b1503)
  let str = NSAttributedString(string: "E", attributes: [.init(kCTFontAttributeName as String): font, .init(kCTForegroundColorAttributeName as String): color])
  let line = CTLineCreateWithAttributedString(str)
  let b = CTLineGetImageBounds(line, ctx)
  ctx.textPosition = CGPoint(x: c.x - b.width / 2 - b.minX, y: c.y - b.height / 2 - b.minY)
  CTLineDraw(line, ctx)
  save(ctx, path)
}

func save(_ ctx: CGContext, _ path: String) {
  let img = ctx.makeImage()!
  let rep = NSBitmapImageRep(cgImage: img)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}

render(1024, .full, "assets/icon.png")
render(1024, .foreground, "assets/android-icon-foreground.png")
render(1024, .background, "assets/android-icon-background.png")
render(1024, .mono, "assets/android-icon-monochrome.png")
render(1024, .splash, "assets/splash-icon.png")
render(48, .full, "assets/favicon.png")
