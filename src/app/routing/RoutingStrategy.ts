import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class RoutingStrategy extends RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        throw new Error("Method not implemented.");
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return false;
    }
    
}
