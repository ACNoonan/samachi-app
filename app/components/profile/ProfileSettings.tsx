'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Wallet, Shield, HelpCircle, LogOut, 
  ChevronRight, Mail, Calendar, 
  Twitter, MessageCircle, X, Link2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer'; // For base64 conversion

// Define a more specific type for settings items
type SettingItem = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  value?: string;
  customRenderer?: () => React.ReactNode;
};

export const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const { user, profile, logout, fetchProfile, isProfileLoading } = useAuth(); // Added fetchProfile and isProfileLoading
  const { publicKey, connected, signMessage, wallet } = useWallet();
  
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [isLinkingWallet, setIsLinkingWallet] = useState(false);
  const [walletLinkError, setWalletLinkError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  const showComingSoon = (service: string) => {
    toast.info(`${service} integration coming soon!`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleLinkWallet = async () => {
    if (!user || !publicKey || !signMessage) {
      toast.error("User not authenticated or wallet not connected properly.");
      return;
    }

    setIsLinkingWallet(true);
    setWalletLinkError(null);

    try {
      const message = `Sign this message to link your wallet to your Samachi account: ${user.id}`;
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      const response = await fetch('/api/profile/link-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedMessage: signatureBase64,
          originalMessage: message,
          walletAddress: publicKey.toBase58(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to link wallet.');
      }

      toast.success("Wallet linked successfully!");
      if (user?.id) {
        await fetchProfile(user.id); // Refresh profile data
      }
    } catch (error: any) {
      console.error("Error linking wallet:", error);
      const errorMessage = error.message || "An unexpected error occurred.";
      setWalletLinkError(errorMessage);
      toast.error("Failed to link wallet", { description: errorMessage });
    } finally {
      setIsLinkingWallet(false);
    }
  };

  const renderTwitterConnect = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Twitter className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">Twitter</span>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => showComingSoon('Twitter')}
            className="text-xs h-7"
          >
            Connect
          </Button>
        </div>
      </div>
    );
  };
  
  const renderTelegramConnect = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">Telegram</span>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => showComingSoon('Telegram')}
            className="text-xs h-7"
          >
            Connect
          </Button>
        </div>
      </div>
    );
  };

  const isWalletEffectivelyLinked = profile?.wallet_address && publicKey && profile.wallet_address === publicKey.toBase58();

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: Twitter,
          label: 'Twitter',
          customRenderer: renderTwitterConnect
        },
        {
          icon: MessageCircle,
          label: 'Telegram',
          customRenderer: renderTelegramConnect
        },
        {
          icon: Wallet, 
          label: 'Connected Wallet',
          customRenderer: () => (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Wallet Connection</span>
                </div>
                <div className="wallet-adapter-dropdown">
                  <WalletMultiButton 
                    className="!bg-transparent !text-foreground hover:!bg-black/5 dark:hover:!bg-white/10 !h-9 !px-2 !text-sm"
                  />
                </div>
              </div>
              {connected && user && publicKey && (
                <div className="mt-2 pt-2 border-t border-gray-100/50">
                  {isWalletEffectivelyLinked ? (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      <span>Wallet successfully linked to your account.</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleLinkWallet} 
                      disabled={isLinkingWallet || !signMessage || isProfileLoading}
                      className="w-full mt-1 h-9 text-sm"
                      variant="outline"
                    >
                      {isLinkingWallet ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Linking...
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4 mr-2" />
                          Link this wallet to Samachi account
                        </>
                      )}
                    </Button>
                  )}
                  {walletLinkError && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> {walletLinkError}
                    </p>
                  )}
                </div>
              )}
              {!connected && user && (
                 <p className="text-xs text-muted-foreground mt-2">Connect your wallet to link it to your account.</p>
              )}
            </div>
          )
        },
        {
          icon: LogOut,
          label: 'Sign Out',
          onClick: handleLogout,
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: Shield, 
          label: 'Privacy & Security',
          onClick: () => setPrivacyModalOpen(true),
        },
        {
          icon: HelpCircle, 
          label: 'Help & Support',
          onClick: () => setSupportModalOpen(true),
        },
      ]
    },
  ];

  return (
    <div className="flex flex-col pt-10 pb-20 px-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mr-4">
            {profile?.username ? profile.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'S')}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile?.username || user?.email || 'Samachi Member'}</h2>
            {user?.email && (
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <Mail className="h-3 w-3 mr-1" />
                {user.email}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm border-t border-gray-100/50 pt-4">          
          {profile?.wallet_address && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Linked Wallet</span>
              <span className="font-medium">{`${profile.wallet_address.substring(0, 6)}...${profile.wallet_address.substring(profile.wallet_address.length - 4)}`}</span>
            </div>
          )}
          {!profile?.wallet_address && connected && publicKey && user && (
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Connected Wallet</span>
                <span className="font-medium text-orange-600">Not linked to account</span>
            </div>
          )}
          
          {user?.created_at && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Member Since</span>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="font-medium">{formatDate(user.created_at)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {settingGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-3">{group.title}</h2>
          
          <div className="glass-card divide-y divide-gray-100/50 overflow-visible">
            {group.items.map((item, itemIndex) => (
              <div 
                key={itemIndex} 
                className={`p-4 ${item.onClick && !item.customRenderer && item.label !== 'Connected Wallet' ? 'cursor-pointer hover:bg-white/60' : ''}`}
                onClick={item.onClick && !item.customRenderer && item.label !== 'Connected Wallet' ? item.onClick : undefined}
              >
                {item.customRenderer ? (
                  item.customRenderer()
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {item.value && (
                        <span className="text-sm text-muted-foreground mr-2">{item.value}</span>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Privacy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Privacy & Security
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <h4 className="text-base font-medium mt-4 mb-2">Overview</h4>
              <p className="text-sm mb-2">
                Samachi ("we", "us", or "our") values your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                mobile-first web application and related services.
              </p>
              
              <h4 className="text-base font-medium mt-4 mb-2">Information We Collect</h4>
              <p className="text-sm mb-1">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Register for an account</li>
                <li>Link your wallet or payment methods</li>
                <li>Use venue-specific services through our platform</li>
                <li>Interact with Glownet-powered venues</li>
                <li>Communicate with our support team</li>
              </ul>
              
              <h4 className="text-base font-medium mt-4 mb-2">How We Use Your Information</h4>
              <p className="text-sm mb-1">
                We use the information we collect to:
              </p>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your account</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate with you about your account and services</li>
                <li>Respond to your inquiries and support requests</li>
              </ul>
              
              <h4 className="text-base font-medium mt-4 mb-2">Data Security</h4>
              <p className="text-sm mb-2">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
              
              <h4 className="text-base font-medium mt-4 mb-2">Your Rights</h4>
              <p className="text-sm mb-1">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Accessing your personal information</li>
                <li>Correcting inaccurate information</li>
                <li>Deleting your personal information</li>
                <li>Restricting or objecting to certain processing activities</li>
                <li>Requesting a copy of your information in a portable format</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Security Information</h3>
              <p className="text-sm mb-2">
                At Samachi, we take the security of your data and digital assets seriously. 
                Here are some of the measures we implement to ensure your security:
              </p>
              
              <h4 className="text-base font-medium mt-3 mb-1">Account Security</h4>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Secure authentication mechanisms</li>
                <li>Regular security audits and testing</li>
                <li>Encrypted data storage and transmission</li>
              </ul>
              
              <h4 className="text-base font-medium mt-3 mb-1">Blockchain Security</h4>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Audited smart contracts</li>
                <li>Non-custodial wallet integration</li>
                <li>Transparent transaction records</li>
              </ul>
              
              <h4 className="text-base font-medium mt-3 mb-1">Security Recommendations</h4>
              <ul className="list-disc text-sm pl-5 space-y-1 mb-2">
                <li>Never share your private keys or seed phrases with anyone</li>
                <li>Use a strong, unique password for your Samachi account</li>
                <li>Be cautious of phishing attempts and only access Samachi through official channels</li>
                <li>Report any suspicious activity to our support team immediately</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Contact us at: <a href="mailto:adam@samachi.com" className="text-primary underline">adam@samachi.com</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Support Modal */}
      <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-primary" />
              Help & Support
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Need assistance?</h3>
            <p className="text-sm">
              For any questions, issues, or feedback regarding your Samachi experience, 
              please reach out to our support team directly.
            </p>
            <p className="text-sm font-medium mt-4">
              Contact us at: <a href="mailto:adam@samachi.com" className="text-primary underline">adam@samachi.com</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for RefreshCw to ensure client-side execution for animation
const RefreshCw = ({ className }: { className?: string }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null; // Or a placeholder
  const LucideRefreshCw = require('lucide-react').RefreshCw;
  return <LucideRefreshCw className={className} />;
};