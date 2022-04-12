import { Octokit } from '@octokit/core';
import { GetGithubToken } from '@wisegar-org/wgo-settings';
import { IssueForm } from '../models/IssueForm';

export default class IssueService {
  /**
   *
   */
  constructor() {}

  async sendIssue(issue: IssueForm) {
    const token = GetGithubToken();
    const octokit = new Octokit({ auth: token });

    try {
      const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner: issue.owner,
        repo: issue.repo,
        title: issue.title,
        body: issue.body,
      });

      return {
        succeeded: true,
      };
    } catch (err) {
      return {
        succeeded: false,
        error: err.message || err.toString(),
      };
    }
  }
}
