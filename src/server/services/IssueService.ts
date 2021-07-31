import { GetGenericConfig } from './ConfigService';
import { Octokit } from '@octokit/core';
import { IssueForm } from '../models/IssueForm';

export default class IssueService {
  
  /**
   *
   */
  constructor() {
    
  }

  async sendIssue(issue: IssueForm) {
    const config = GetGenericConfig();
    const octokit = new Octokit({ auth: config.GITHUB_TOKEN });

    const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner: issue.owner,
        repo: issue.repo,
        title: issue.title,
        body: issue.body
      });

      return {
        succeeded: true,
      };
  }
  
}
