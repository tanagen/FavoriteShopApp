declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        MYSQL_DATABASE: string;
        MYSQL_USER: string;
        MYSQL_PASSWORD: string;
        // ...
      }
    }
  }
}
