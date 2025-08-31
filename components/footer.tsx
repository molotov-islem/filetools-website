import { Heart } from "lucide-react"

export function Footer() {
  const footerLinks = {
    Tools: ["PDF Tools", "Image Tools", "Office Tools"],
    Company: ["About Us", "Contact", "Blog", "Help Center"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  }

  return (
    <footer className="bg-gradient-secondary/5 border-t border-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/images/filetools-logo.png" alt="File Tools" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">FileTools</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Fast, free, and secure file conversion tools. Process your files online without downloads or sign-ups.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-secondary fill-secondary" />
              <span>by FileTools</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary/10 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2025 FileTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
