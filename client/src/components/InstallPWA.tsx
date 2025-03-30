import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download } from 'lucide-react';
import { isAppInstalled } from '../registerServiceWorker';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // If the app is already installed, don't show the install button
    if (isAppInstalled()) {
      setIsInstallable(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setIsInstallable(true);
    };

    // Check if it's iOS device
    const isIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    };

    if (isIOS()) {
      setShowIOSInstructions(true);
      setIsInstallable(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (showIOSInstructions) {
      setShowDialog(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstallable(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the deferredPrompt for the next time
      setDeferredPrompt(null);
    });
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleInstallClick}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Install App
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Install FarmLinker on your iOS device</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>To install FarmLinker on your iOS device:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Tap the <span className="inline-flex items-center px-2 border rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3.333L15 8.333H11.6667V15H8.33333V8.333H5L10 3.333Z" fill="currentColor"/>
                      <path d="M3.33333 16.6667H16.6667V13.3333H18.3333V16.6667C18.3333 17.5833 17.5833 18.3333 16.6667 18.3333H3.33333C2.41667 18.3333 1.66667 17.5833 1.66667 16.6667V13.3333H3.33333V16.6667Z" fill="currentColor"/>
                    </svg>
                  </span> Share button at the bottom of the screen</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                  <li>Tap <strong>Add</strong> in the top-right corner</li>
                </ol>
                <p>FarmLinker will now appear on your home screen like a native app!</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}