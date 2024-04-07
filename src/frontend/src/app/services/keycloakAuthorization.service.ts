import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakAuthorizationService {
  private config: any;
  private clientId: string = '';

  constructor(
    private keycloakService: KeycloakService,
    private httpClient: HttpClient
  ) {}

  public async hasEntitlement(
    resource: string,
    resourceId: string,
    scope: string
  ): Promise<boolean> {
    if (!this.config) {
      const keycloak = this.keycloakService.getKeycloakInstance();
      this.clientId = keycloak.clientId ?? '';
      this.config = await firstValueFrom(this.httpClient
        .get(
          keycloak.authServerUrl +
            '/realms/' +
            keycloak.realm +
            '/.well-known/uma2-configuration'
        ));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'urn:ietf:params:oauth:grant-type:uma-ticket');
    body.set('client_id', this.clientId);
    body.set('permission', `${resourceId}#${scope}`);
    body.set('audience', resource);
    body.set('response_mode', 'decision');

    try {
      const result = await firstValueFrom(this.httpClient
      .post<{ result: boolean }>(this.config.token_endpoint, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      }));
      return result.result;
    } catch (error) {
      return false;
    }
  }
}
