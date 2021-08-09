import { ExportableForm } from '../decorators/rest/Export';

export class IssueForm extends ExportableForm {
  owner: string;
  repo: string;
  title: string;
  body: string;
  constructor() {
    super();
    this.owner = '';
    this.repo = '';
    this.title = '';
    this.body = '';
  }
}
