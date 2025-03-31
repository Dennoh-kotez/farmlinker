import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadApp() {
  const apkUrl = "/download/farmlinker.apk"; // Replace with your actual APK URL

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Download Our Mobile App</h1>
          <p className="text-xl text-gray-600 mb-10">
            Get the full FarmLinker experience on your mobile device.
          </p>
          <Button asChild>
            <a href={apkUrl} download="farmlinker.apk" className="px-8 py-3 rounded-md bg-primary text-white hover:bg-primary/90">
              Download APK <Download className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="mt-6 text-gray-500">
            Scan the QR code below to download the app directly:
          </p>
          {/* Add QR code here, you can use a library like qrcode.react */}
          <div>
            {/* Example QR Code (replace with actual QR code) */}
            <img
              src="https://via.placeholder.com/150"
              alt="QR Code"
              className="mx-auto mt-4"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}