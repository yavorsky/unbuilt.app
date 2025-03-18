'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { GithubIcon } from '../icons/github';
import { useActiveRoute } from '@/app/hooks/use-active-route';
import { ToggleTheme } from '../toggle-theme';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { trackNavigation } from '@/app/utils/analytics';

export const AppNavigationMenu = () => {
  const activeRoute = useActiveRoute();

  return (
    <NavigationMenu className="py-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`inline-flex h-9 rounded-md px-2 lg:px-4 md:px-4 py-2 text-sm text-foreground/70 data-[active=true]:text-foreground hover:text-foreground`}
            data-active={activeRoute === 'ANALYZE'}
            href="/"
          >
            Analyze
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className="inline-flex h-9 px-2 lg:px-4 md:px-4 py-2 text-sm text-foreground/70  data-[active=true]:text-foreground hover:text-foreground"
            data-active={activeRoute === 'TECHNOLOGIES'}
            href="/technologies"
          >
            Technologies
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm text-foreground/70 hover:text-foreground px-2 lg:px-4 md:px-4 py-2">
              Apps
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-sm">
              <DropdownMenuItem disabled>
                <b>Browser Extension</b> - <span>Coming Soon</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <b>CLI</b> - <span>Coming Soon</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="inline-flex h-9 px-4 py-2 text-sm"
            href="https://github.com/yavorsky/unbuilt.app"
            target="_blank"
            onClick={() => trackNavigation('github', true)}
          >
            <GithubIcon
              size={20}
              className="fill-foreground/80 hover:fill-foreground"
            />
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ToggleTheme />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
