import { ExportableForm } from "@wisegar-org/wgo-opengar-core/build/src/server/decorators/rest/Export";

export class IssueForm extends ExportableForm {
  owner: string;
  repo: string;
  title: string;
  body: string;
  constructor() {
    super();
    this.owner = "";
    this.repo = "";
    this.title = "";
    this.body = "";
  }
}
