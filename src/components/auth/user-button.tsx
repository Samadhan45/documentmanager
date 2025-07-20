'use client';

import {useRouter} from 'next/navigation';
import {getAuth, signOut} from 'firebase/auth';
import {firebaseApp} from '@/lib/firebase/config';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useAuthContext} from '@/lib/firebase/auth-context';
import {LogOut, User} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

const auth = getAuth(firebaseApp);

export function UserButton() {
  const {user} = useAuthContext();
  const router = useRouter();
  const {toast} = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error: any) {
      toast({
        title: 'Sign-out Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null;
  }

  const getAvatarFallback = () => {
    if (user.isAnonymous) {
      return <User />;
    }
    if (user.displayName) {
        return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return <User />;
  }

  const getDisplayName = () => {
    if (user.isAnonymous) {
      return 'Guest User';
    }
    return user.displayName || user.email || 'User';
  }

  const getDisplayIdentifier = () => {
    if (user.isAnonymous) {
      return `ID: ${user.uid.substring(0, 6)}...`;
    }
    return user.email || user.phoneNumber;
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
            <AvatarFallback>
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getDisplayIdentifier()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
