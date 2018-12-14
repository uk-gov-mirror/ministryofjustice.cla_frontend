# -*- encoding: utf-8 -*-
"""View for postcode lookups"""

from django.conf import settings
from cla_common.address_lookup.ordnance_survey import FormattedAddressLookup
from django.http import JsonResponse

def postcode_lookup(request):
    postcode = request.GET.get('postcode')
    key = settings.OS_PLACES_API_KEY
    formatted_address = FormattedAddressLookup(key=key).by_postcode(postcode)
    # print("FORMATED ADDRESS", formatted_address)
    response = [{'formatted_address': address } for address in formatted_address if address]
    # print("response", response)
    response = JsonResponse(response, safe=False)
    # print("response 2", response.content)
    print("Response status_code", response.status_code)
    return response
