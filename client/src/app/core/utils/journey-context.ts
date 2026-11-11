import { ActivatedRoute, Params } from '@angular/router';

export interface SearchQuery {
  location: string;
  pickupDate: string;
  returnDate: string;
}

export function readSearchQuery(route: ActivatedRoute): SearchQuery {
  const q = route.snapshot.queryParamMap;
  return {
    location: q.get('location') ?? '',
    pickupDate: q.get('pickupDate') ?? '',
    returnDate: q.get('returnDate') ?? '',
  };
}

export function searchQueryParams(search: SearchQuery): Params {
  const params: Params = {};
  if (search.location.trim()) {
    params['location'] = search.location.trim();
  }
  if (search.pickupDate) {
    params['pickupDate'] = search.pickupDate;
  }
  if (search.returnDate) {
    params['returnDate'] = search.returnDate;
  }
  return params;
}
