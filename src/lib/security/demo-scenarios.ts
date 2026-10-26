export interface SimPort {
  port: number;
  protocol: "tcp";
  state: "open" | "closed" | "filtered";
  service: string;
  explanation: string;
  falsePositiveNote: string;
  remediation: string;
}

export interface SimScenario {
  id: string;
  title: string;
  /** Documentation-range address (RFC 5737). It is never contacted. */
  target: string;
  description: string;
  ports: SimPort[];
}

const common = {
  protocol: "tcp" as const,
};

export const simScenarios: SimScenario[] = [
  {
    id: "small-web-server",
    title: "Small web server",
    target: "192.0.2.10 (RFC 5737 documentation address, never contacted)",
    description: "A fictional host that serves a website and accepts remote administration.",
    ports: [
      {
        ...common,
        port: 22,
        state: "open",
        service: "ssh",
        explanation:
          "A TCP handshake completed on port 22, which is conventionally used by SSH for remote administration.",
        falsePositiveNote:
          "Port numbers are conventions. Another service could listen here; a banner or protocol check is needed to confirm.",
        remediation:
          "Restrict SSH to trusted addresses, disable password logins in favor of keys, and keep the service patched.",
      },
      {
        ...common,
        port: 80,
        state: "open",
        service: "http",
        explanation: "Port 80 accepted a connection. It is conventionally unencrypted HTTP.",
        falsePositiveNote: "A load balancer or proxy in front of the host can answer for it.",
        remediation: "Redirect HTTP to HTTPS and send an HSTS header once HTTPS is verified.",
      },
      {
        ...common,
        port: 443,
        state: "open",
        service: "https",
        explanation: "Port 443 accepted a connection, conventionally HTTPS.",
        falsePositiveNote: "An open port says nothing about TLS quality. That needs a separate configuration review.",
        remediation: "Review the TLS configuration and certificate lifecycle.",
      },
      {
        ...common,
        port: 3306,
        state: "filtered",
        service: "mysql",
        explanation:
          "No response arrived. A firewall silently dropping packets looks like this, but so does packet loss.",
        falsePositiveNote: "Filtered is not the same as closed or secure. A retry from another vantage point may differ.",
        remediation: "Keep databases off public interfaces; allow access only from application hosts.",
      },
      {
        ...common,
        port: 8080,
        state: "closed",
        service: "http-alt",
        explanation: "The host actively refused the connection (reset), so nothing is listening on this port.",
        falsePositiveNote: "A service may start later, and a firewall can forge resets.",
        remediation: "No action needed unless a service is expected here.",
      },
    ],
  },
  {
    id: "lab-database-host",
    title: "Lab database host",
    target: "198.51.100.20 (RFC 5737 documentation address, never contacted)",
    description: "A fictional host where a database is reachable more widely than intended.",
    ports: [
      {
        ...common,
        port: 22,
        state: "filtered",
        service: "ssh",
        explanation: "No response. Likely a firewall rule limiting SSH to certain sources.",
        falsePositiveNote: "From an allowed source the port may well be open.",
        remediation: "Confirm the allow-list matches who actually needs access.",
      },
      {
        ...common,
        port: 5432,
        state: "open",
        service: "postgresql",
        explanation: "A connection to the PostgreSQL default port succeeded from the scan source.",
        falsePositiveNote: "Reachability does not mean unauthenticated access; authentication was not tested.",
        remediation: "Bind to private interfaces, require TLS and strong authentication, and limit source addresses.",
      },
      {
        ...common,
        port: 6379,
        state: "closed",
        service: "redis",
        explanation: "Connection refused: nothing listening on the Redis default port.",
        falsePositiveNote: "Redis could be running on a non-default port, which this scan did not cover.",
        remediation: "No action needed for this port.",
      },
    ],
  },
];
