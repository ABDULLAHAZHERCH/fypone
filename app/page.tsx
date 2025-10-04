import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-foreground">v-FIT</span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-foreground hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            The Future of
            <span className="text-blue-600"> Virtual Fitting</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Create your 3D Digital Twin and try on clothes virtually. Reduce returns, increase confidence, and shop smarter with v-FIT&apos;s revolutionary virtual fitting room technology.
          </p>
          
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-lg h-12 px-8"
            >
              🚀 Try v-FIT Now
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-lg h-12 px-8 text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              👤
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Digital Twin Creation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload photos to generate your personalized 3D avatar with accurate body measurements
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              👕
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Virtual Try-On</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See exactly how clothes fit and look on your body before making a purchase
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              📱
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AR Experience</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Coming soon: Mobile AR for real-time virtual fitting in your own space
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Experience the Future?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join the revolution in online shopping. Create your account and start your virtual fitting journey.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get Started Free
            <span>→</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-bold text-foreground">v-FIT</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 v-FIT. Revolutionizing virtual fashion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}