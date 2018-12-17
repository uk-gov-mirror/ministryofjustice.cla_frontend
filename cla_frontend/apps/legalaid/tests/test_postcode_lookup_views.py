# -*- encoding: utf-8 -*-
# coding=utf-8
"Tests for postcode_lookup view"

from contextlib import contextmanager
import json
import unittest

import mock

from legalaid.postcode_lookup_views import postcode_lookup
from core.testing.test_base import CLATFrontEndTestCase
from django.test import RequestFactory
from legalaid.postcode_lookup_views import postcode_lookup

key='fake_key'
postcode = 'sw1a1aa'
postcode_is_None = None
malformed_postcode = 'skd99kdf12ws'
postcode_is_valid_but_doesnt_exist = 'bc99dd'
postcode_is_an_empty_string = " "
expected_formatted_result = [{"formatted_address": "Buckingham Palace\nLondon\nSW1A 1AA"}]

class PostcodeLookupViewsTest(unittest.TestCase):
    def setUp(self):
        self.request = RequestFactory().get("")
        self.request.user = mock.MagicMock()
        self.lookup_method_name = "cla_common.address_lookup.ordnance_survey.FormattedAddressLookup.by_postcode"

    def assert_address_response(self, addresses, response):
        self.assertEqual(json.dumps(addresses), response.content)

    def test_postcode_lookup_returns_an_address_if_postcode_is_valid(self):
        self.request.return_value = postcode
        prerecorded_result = [u'Buckingham Palace\nLondon\nSW1A 1AA']
        with mock.patch(self.lookup_method_name) as mock_method:
            mock_method.return_value = prerecorded_result
            response = postcode_lookup(self.request)
            self.assertEqual(200, response.status_code)
            self.assert_address_response(expected_formatted_result, response)

    def test_postcode_lookup_returns_a_404_error_if_postcode_is_None(self):
        self.request.return_value = postcode_is_None
        with mock.patch(self.lookup_method_name) as mock_method:
            mock_method.return_value = []
            response = postcode_lookup(self.request)
            self.assertEqual(404, response.status_code)
            self.assert_address_response([], response)

    def test_postcode_lookup_returns_a_404_error_if__postcode_is_malformed(self):
        self.request.return_value = malformed_postcode
        with mock.patch(self.lookup_method_name) as mock_method:
            mock_method.return_value = []
            response = postcode_lookup(self.request)
            self.assertEqual(404, response.status_code)
            self.assert_address_response([], response)

    def test_postcode_lookup_returns_an_empty_list_if_postcode_is_valid_but_doesnt_exist(self):
        self.request.return_value = postcode_is_valid_but_doesnt_exist
        with mock.patch(self.lookup_method_name) as mock_method:
            mock_method.return_value = []
            response = postcode_lookup(self.request)
            self.assertEqual(404, response.status_code)
            self.assert_address_response([], response)

    def test_postcode_lookup_returns_a_404_error_list_if__postcode_is_an_empty_string(self):
        self.request.return_value = postcode_is_an_empty_string
        with mock.patch(self.lookup_method_name) as mock_method:
            mock_method.return_value = []
            response = postcode_lookup(self.request)
            self.assertEqual(404, response.status_code)
            self.assert_address_response([], response)
