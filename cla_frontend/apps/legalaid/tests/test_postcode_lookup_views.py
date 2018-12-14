# -*- encoding: utf-8 -*-
"Tests for postcode_lookup view"

from contextlib import contextmanager
import json
import unittest

import mock

from legalaid.postcode_lookup_views import postcode_lookup
from cla_common.address_lookup.ordnance_survey import FormattedAddressLookup

postcode = 'sw1a1aa'
postcode_is_NONE = None
malformed_postcode = 'skd99kdf12ws'
postcode_is_valid_but_doesnt_exist = 'ms46kb'
postcode_is_an_empty_string = " "
# formatted_address = [
#     {
#         "formatted_address": "Buckingham Palace\nLondon\nSW1A 1AA",
#     }
# ]
# formatted_address = [u'Buckingham Palace\nLondon\nSW1A 1AA']
# formatted_address = [{"Buckingham Palace\nLondon\nSW1A 1AA"}]
# # formatted_address = [{u'Buckingham Palace\nLondon\nSW1A 1AA'}]

# @contextmanager
# def patch_postcodeinfo(postcode, result):
#     with mock.patch('cla_common.address_lookup.ordnance_survey.FormattedAddressLookup.by_postcode') as mock_method:
#         mock_method.return_value = {"Buckingham Palace\nLondon\nSW1A 1AA"}
#         lookup = mock_method.by_postcode

#         if callable(result):
#             lookup.side_effect = result
#         else:
#             lookup.return_value.addresses = result

#         yield

        # client.assertCalled()
        # lookup.assertCalledWith(postcode)


class PostcodeLookupViewsTest(unittest.TestCase):

    def setUp(self):
        self.request = mock.Mock()
        self.request.user.is_authenticated.return_value = True

    def assert_address_response(self, addresses, response):
        print("JSON DUMPS ADDRESS", json.dumps(addresses))
        print("RESPONSE CONTENT", response.content)
        self.assertEqual(json.dumps(addresses), response.content)

    def test_postcode_lookup_returns_an_address_if_postcode_is_valid(self):
        self.request.GET.get.return_value = postcode
        # with patch_postcodeinfo(postcode, formatted_address):
        self.assertEqual(200, response.status_code)
        response = postcode_lookup(self.request)
        self.assert_address_response(formatted_address, response)

    def test_postcode_lookup_returns_a_404_error_if_postcode_is_NONE(self):
        self.request.GET.get.return_value = postcode_is_NONE
        response = postcode_lookup(self.request)
        print(response.status_code)
        self.assertEqual(404, response.status_code)
        self.assert_address_response([], response)

    def test_postcode_lookup_returns_a_404_error_if__postcode_is_malformed(self):
        print(self.request.GET.get.return_value)
        self.request.GET.get.return_value = malformed_postcode
        response = postcode_lookup(self.request)
        self.assertEqual(404, response.status_code)
        self.assert_address_response([], response)


    def test_postcode_lookup_returns_an_empty_list_if_postcode_is_valid_but_doesnt_exist(self):
        self.request.GET.get.return_value = postcode_is_valid_but_doesnt_exist
        response = postcode_lookup(self.request)
        self.assertEqual(200, response.status_code)
        self.assert_address_response([], response)

    def test_postcode_lookup_returns_a_404_error_list_if__postcode_is_an_empty_string(self):
        self.request.GET.get.return_value = postcode_is_an_empty_string
        response = postcode_lookup(self.request)
        self.assertEqual(404, response.status_code)
        self.assert_address_response([], response)


