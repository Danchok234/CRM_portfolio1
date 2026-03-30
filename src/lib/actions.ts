"use server";

import {
  getAllCalls,
  getAllContacts,
  getCallById,
  getContactById,
  getFollowUps,
  getRecentCalls,
  markFollowUpDone,
  searchContacts,
  updateContact,
} from "./queries";

export async function fetchRecentCalls(limit = 10) {
  return getRecentCalls(limit);
}

export async function fetchAllCalls(
  page?: number,
  limit?: number,
  sentimentFilter?: string,
  dateFrom?: string,
  dateTo?: string
) {
  return getAllCalls(page, limit, sentimentFilter, dateFrom, dateTo);
}

export async function fetchCallById(id: string) {
  return getCallById(id);
}

export async function fetchAllContacts(page?: number, limit?: number) {
  return getAllContacts(page, limit);
}

export async function fetchContactById(id: string) {
  return getContactById(id);
}

export async function fetchSearchContacts(
  query: string,
  page?: number,
  limit?: number
) {
  return searchContacts(query, page, limit);
}

export async function fetchFollowUps(
  doneFilter?: "pending" | "completed" | "all"
) {
  return getFollowUps(doneFilter);
}

export async function doMarkFollowUpDone(id: string) {
  return markFollowUpDone(id);
}

export async function doUpdateContact(
  id: string,
  fields: { name?: string; email?: string; company?: string }
) {
  return updateContact(id, fields);
}
