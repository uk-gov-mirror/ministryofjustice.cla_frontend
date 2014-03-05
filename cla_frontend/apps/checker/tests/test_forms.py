import mock

from core.testing.testcases import CLATestCase
from django.forms.formsets import formset_factory

from ..forms import YourProblemForm, YourFinancesForm, ApplyForm, ResultForm, \
    YourFinancesPropertyForm, OnlyAllowExtraIfNoInitialFormSet, \
    YourDisposableIncomeForm, YourDetailsForm
from ..exceptions import InconsistentStateException

from .fixtures import mocked_api


class YourFinancesFormTestCase(CLATestCase):

    all_forms = {'your_savings',
                  'partners_savings',
                  'partners_income',
                  'your_other_properties',
                  'dependants',
                  'your_income'}

    partner_forms = {
        'partners_savings',
        'partners_income',
    }

    children_forms = {'dependants'}
    property_forms = {'your_other_properties'}

    def setUp(self):
        super(YourFinancesFormTestCase, self).setUp()
        self.mocked_connection.eligibility_check.post.return_value = mocked_api.ELIGIBILITY_CHECK_CREATE_FROM_YOUR_FINANCES
        self.mocked_connection.eligibility_check('123456789').patch.return_value = mocked_api.ELIGIBILITY_CHECK_UPDATE_FROM_YOUR_FINANCES

    def test_get(self):
        # TEST: a blank GET to the this form - all subforms should be visible

        form = YourFinancesForm()

        self.assertSetEqual(set(dict(form.forms_list).keys()),
                             self.all_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), {'property'})

    def test_get_no_partner(self):
        # TEST: no questions about partner should be visible
        # if the form was created with a has_partner=False kwarg

        form = YourFinancesForm(has_partner=False)
        self.assertSetEqual(set(dict(form.forms_list).keys()),
                            self.all_forms-self.partner_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), {'property'})

    def test_get_no_children(self):
        # TEST: no forms related to children should be show
        # if form instantiated with has_children=Falase

        form = YourFinancesForm(has_children=False)
        self.assertSetEqual(set(dict(form.forms_list).keys()),
                           self.all_forms-self.children_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), {'property'})

    def test_get_no_property(self):
        form = YourFinancesForm(has_property=False)
        self.assertSetEqual(set(dict(form.forms_list).keys()),
                            self.all_forms-self.property_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), set())


    def test_get_no_property_no_children(self):
        form = YourFinancesForm(has_property=False, has_children=False)
        self.assertSetEqual(set(dict(form.forms_list).keys()),
                            self.all_forms-self.children_forms-self.property_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), set())

    def test_get_no_property_no_children_no_partner(self):
        form = YourFinancesForm(has_property=False, has_children=False, has_partner=False)
        self.assertSetEqual(set(dict(form.forms_list).keys()),
                            self.all_forms-self.children_forms-self.partner_forms-self.property_forms)

        self.assertSetEqual(set(dict(form.formset_list).keys()), set())

    def test_get_has_single_new_property(self):
        form = YourFinancesForm()
        self.assertTrue(len(form.get_form_by_prefix('property').forms), 1)

    def _get_default_post_data(self):
        return {
            u'dependants-dependants_old': u'1',
            u'dependants-dependants_young': u'1',
            u'partners_income-earnings_per_month': u'100',
            u'partners_income-other_income_per_month': u'100',
            u'partners_income-self_employed': u'0',
            u'partners_savings-bank': u'100',
            u'partners_savings-investments': u'100',
            u'partners_savings-money_owed': u'100',
            u'partners_savings-valuable_items': u'100',
            u'property-0-mortgage_left': u'50000',
            u'property-0-owner': u'1',
            u'property-0-share': u'100',
            u'property-0-worth': u'100000',
            u'property-INITIAL_FORMS': u'0',
            u'property-MAX_NUM_FORMS': u'20',
            u'property-TOTAL_FORMS': u'1',
            u'your_income-earnings_per_month': u'100',
            u'your_income-other_income_per_month': u'100',
            u'your_income-self_employed': u'0',
            u'your_other_properties-other_properties': u'0',
            u'your_savings-bank': u'100',
            u'your_savings-investments': u'100',
            u'your_savings-money_owed': u'100',
            u'your_savings-valuable_items': u'100'}

    def _get_default_api_post_data(self):
        return {
        "partner_finances": {"other_income": 10000,
                             "investment_balance": 10000,
                             "earnings": 10000,
                             "bank_balance": 10000,
                             "credit_balance": 10000,
                             "asset_balance": 10000},
        "dependants_old": 0,
        "property_set": [{"share": 100, "value": 10000000, "mortgage_left": 5000000}],
        "your_finances": {"other_income": 10000,
                          "investment_balance": 10000,
                          "earnings": 10000,
                          "bank_balance": 10000,
                          "credit_balance": 10000,
                          "asset_balance": 10000},
        "dependants_young": 0}

    def test_post(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())


        self.assertTrue(form.get_form_by_prefix('dependants').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_other_properties').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_income').is_valid())
        self.assertTrue(form.get_form_by_prefix('partners_income').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_savings').is_valid())
        self.assertTrue(form.get_form_by_prefix('partners_savings').is_valid())
        for f in form.get_form_by_prefix('property'):
            self.assertTrue(f.is_valid())

        response_data = form.save()
        self.assertDictEqual(response_data, {
            'eligibility_check': mocked_api.ELIGIBILITY_CHECK_CREATE_FROM_YOUR_FINANCES
        })
        self.mocked_connection.eligibility_check.post.assert_called_with(self._get_default_api_post_data())

    def test_post_update(self):
        # TEST a post to eligibility check when we already have a reference
        form = YourFinancesForm(data=self._get_default_post_data())
        form.reference = '1234567890'

        self.assertTrue(form.get_form_by_prefix('dependants').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_other_properties').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_income').is_valid())
        self.assertTrue(form.get_form_by_prefix('partners_income').is_valid())
        self.assertTrue(form.get_form_by_prefix('your_savings').is_valid())
        self.assertTrue(form.get_form_by_prefix('partners_savings').is_valid())
        for f in form.get_form_by_prefix('property'):
            self.assertTrue(f.is_valid())

        response_data = form.save()
        self.assertDictEqual(response_data, {
            'eligibility_check': mocked_api.ELIGIBILITY_CHECK_UPDATE_FROM_YOUR_FINANCES
        })

    def test_post_subform_dependants(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())


        self.assertTrue(form.get_form_by_prefix('dependants').is_valid())
        self.assertEqual(form.get_form_by_prefix('dependants').cleaned_data['dependants_young'], 1)
        self.assertEqual(form.get_form_by_prefix('dependants').cleaned_data['dependants_old'], 1)

        self.assertTrue(form.get_form_by_prefix('your_other_properties').is_valid())
        self.assertEqual(form.get_form_by_prefix('your_other_properties').cleaned_data['other_properties'], False)


    def test_post_subform_other_properties(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())

        self.assertTrue(form.get_form_by_prefix('your_other_properties').is_valid())
        self.assertEqual(form.get_form_by_prefix('your_other_properties').cleaned_data['other_properties'], False)

    def test_post_subform_partners_income(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())

        self.assertTrue(form.get_form_by_prefix('partners_income').is_valid())
        self.assertEqual(form.get_form_by_prefix('partners_income').cleaned_data['earnings_per_month'], 10000)
        self.assertEqual(form.get_form_by_prefix('partners_income').cleaned_data['other_income_per_month'], 10000)
        self.assertEqual(form.get_form_by_prefix('partners_income').cleaned_data['self_employed'], False)

    def test_post_subform_your_income(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())

        self.assertTrue(form.get_form_by_prefix('your_income').is_valid())
        self.assertEqual(form.get_form_by_prefix('your_income').cleaned_data['earnings_per_month'], 10000)
        self.assertEqual(form.get_form_by_prefix('your_income').cleaned_data['other_income_per_month'], 10000)
        self.assertEqual(form.get_form_by_prefix('your_income').cleaned_data['self_employed'], False)

    def test_post_subform_your_other_properties(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())
        self.assertTrue(form.get_form_by_prefix('your_other_properties').is_valid())
        self.assertEqual(form.get_form_by_prefix('your_other_properties').cleaned_data['other_properties'], False)

    def test_post_subform_your_savings(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())
        self.assertTrue(form.get_form_by_prefix('your_savings').is_valid())
        self.assertEqual(form.get_form_by_prefix('your_savings').cleaned_data['bank'], 10000)
        self.assertEqual(form.get_form_by_prefix('your_savings').cleaned_data['investments'], 10000)
        self.assertEqual(form.get_form_by_prefix('your_savings').cleaned_data['money_owed'], 10000)
        self.assertEqual(form.get_form_by_prefix('your_savings').cleaned_data['valuable_items'], 10000)

    def test_post_subform_partner_savings(self):
        # TEST post with full data, simple case
        form = YourFinancesForm(data=self._get_default_post_data())
        self.assertTrue(form.get_form_by_prefix('partners_savings').is_valid())
        self.assertEqual(form.get_form_by_prefix('partners_savings').cleaned_data['bank'], 10000)
        self.assertEqual(form.get_form_by_prefix('partners_savings').cleaned_data['investments'], 10000)
        self.assertEqual(form.get_form_by_prefix('partners_savings').cleaned_data['money_owed'], 10000)
        self.assertEqual(form.get_form_by_prefix('partners_savings').cleaned_data['valuable_items'], 10000)

    def test_form_validation(self):
        default_data = self._get_default_post_data()

        ERRORS_DATA =  {
            'your_savings': # only checking one, not partners_savins
                [
                    # your savings is mandatory
                    {
                        'data': {'your_savings-bank': None,
                                 'your_savings-investments': None,
                                 'your_savings-money_owed': None
                        },
                        'error': {'bank': [u'This field is required.'],
                                  'investments': [u'This field is required.'],
                                  'money_owed': [u'This field is required.']
                        }
                    },
                    {
                        'data': {'your_savings-bank': -1,
                                 'your_savings-investments': -1,
                                 'your_savings-money_owed': -1
                        },
                        'error': {'bank': [u'Ensure this value is greater than or equal to 0.'],
                                  'investments': [u'Ensure this value is greater than or equal to 0.'],
                                  'money_owed': [u'Ensure this value is greater than or equal to 0.']
                        }
                    },
                    ],
            'your_income': # only checking one, not partners_income
                [
                    {
                        'data': {
                            'your_income-earnings_per_month': -1,
                        },
                        'error': {
                            'earnings_per_month': [u'Ensure this value is greater than or equal to 0.']
                        }
                    }
                ]
        }


        for error_section_name, error_section_vals in ERRORS_DATA.items():
            for error_data in error_section_vals:
                data = dict(default_data)
                data.update(error_data['data'])

                form = YourFinancesForm(data=data)
                self.assertFalse(form.is_valid())
                self.assertEqual(form.errors[error_section_name], error_data['error'])


    # TEST Calculated fields

    def test_get_income_doesnt_raise_error_if_no_partner(self):
        data = {k:v for k,v in self._get_default_post_data().items() if not k.startswith('partners')}
        form = YourFinancesForm(data=data, has_partner=False)
        self.assertTrue(form.is_valid(), form.errors)
        form.get_income('partners_income', form.cleaned_data)

    def test_get_capital_doesnt_raise_error_if_no_partner(self):
        data = {k:v for k,v in self._get_default_post_data().items() if not k.startswith('partners')}
        form = YourFinancesForm(data=data, has_partner=False)
        self.assertTrue(form.is_valid(), form.errors)
        form.get_income('partners_savings', form.cleaned_data)

    def test_get_properties_doesnt_error_if_no_properties(self):
        data = {k: v for k,v in self._get_default_post_data().items() if not k.startswith('property') }
        form = YourFinancesForm(data=data, has_property=False)
        self.assertTrue(form.is_valid(), msg=form.errors)
        self.assertListEqual(form.get_properties(form.cleaned_data),[])

    def test_form_invalid_if_no_properties_and_but_has_properties(self):
        data = {k: v for k,v in self._get_default_post_data().items() if not k.startswith('property-0') }
        form = YourFinancesForm(data=data)
        self.assertTrue(form.is_valid(), msg=form.errors)

 # CALCULATED TESTS REDUNDANT AND TO BE REMOVED
    def test_calculated_earned_income(self):
        form = YourFinancesForm(data=self._get_default_post_data())
        self.assertTrue(form.is_valid())
        self.assertEqual(form.total_earnings, 40000)

    def test_calculated_capital_assets(self):
        form = YourFinancesForm(data=self._get_default_post_data())
        self.assertTrue(form.is_valid())
        # this should be their share of any properties
        # plus any savings
        properties_value = sum([(int(max(x['value'], 0) - x['mortgage_left'])*(x['share'] / 100.0)) for x in form.get_properties(form.cleaned_data)])
        self.assertEqual(properties_value, 5000000)
        self.assertEqual(form.total_capital_assets, 80000 + 5000000)

    def test_calculated_capital_assets_no_property(self):
        data = {k: v for k,v in self._get_default_post_data().items() if not k.startswith('property-0')}
        form = YourFinancesForm(data=data)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.total_capital_assets, 80000)

    def test_calculated_capital_assets_two_property(self):
        default_data = self._get_default_post_data()
        default_data['property-TOTAL_FORMS'] = u'2'
        new_data = {k.replace('0','1'): v for k,v in default_data.items() if  k.startswith('property-0')}
        default_data.update(new_data)
        form = YourFinancesForm(data=default_data)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.total_capital_assets, 80000 + (5000000 * 2))


class YourFinancesPropertyFormSetTeseCase(CLATestCase):

    def test_no_extra_allowed_if_initial_data_supplied(self):
        YourFinancesPropertyFormSet = formset_factory(
        YourFinancesPropertyForm,
        extra=1,
        max_num=20,
        validate_max=True,
        formset=OnlyAllowExtraIfNoInitialFormSet
        )
        formset = YourFinancesPropertyFormSet(initial=[
            {"share": 100, "value": 100000, "mortgage_left": 50000},
            {"share": 100, "value": 100000, "mortgage_left": 50000}])
        self.assertEqual(formset.extra, 0)


    def test_one_extra_allowed_if_no_initial_data_supplied(self):
        YourFinancesPropertyFormSet = formset_factory(
            YourFinancesPropertyForm,
            extra=1,
            max_num=20,
            validate_max=True,
            formset=OnlyAllowExtraIfNoInitialFormSet
        )
        formset = YourFinancesPropertyFormSet()
        self.assertEqual(formset.extra, 1)


class YourDetailsFormTestCase(CLATestCase):
    def setUp(self):
        super(YourDetailsFormTestCase, self).setUp()


    def test_get(self):
        form = YourDetailsForm()
        self.assertFalse(form.is_valid())

    def _get_default_post_data(self):
        return {
            'older_than_sixty': 0,
            'has_partner': 0,
            'has_benefits': 0,
            'has_children': 0,
            'caring_responsibilities': 0,
            'own_property': 0,
            'risk_homeless': 0,
        }

    def _get_default_post_data_response(self):
        return {
            'reference': '123456789',
            "category": 'null',
            "your_problem_notes": "",
            "notes": "",
            "property_set": [],
            "your_finances": 'null',
            "partner_finances": 'null',
            "dependants_young": 0,
            "dependants_old": 0,
            "is_you_or_your_partner_over_60": True,
            "has_partner": True,
            "on_passported_benefits": True
        }

    def test_basic_post(self):
        data = self._get_default_post_data()
        form = YourDetailsForm(data=data)
        self.assertTrue(form.is_valid())

        self.mocked_connection.eligibility_check.post.return_value = self._get_default_post_data_response()
        response = form.save()
        self.mocked_connection.eligibility_check.post.assert_called_with({
            'on_passported_benefits': data['has_benefits'],
            'is_you_or_your_partner_over_60': data['older_than_sixty'],
            'has_partner': data['has_partner']
        })
        self.assertTrue('reference' in response['eligibility_check'])
        self.assertDictContainsSubset(
            {
                'is_you_or_your_partner_over_60': True,
                'has_partner': True,
                'on_passported_benefits': True
            },
            response['eligibility_check'])

    def test_form_validation_error(self):
        default_data = self._get_default_post_data()
        ERRORS_DATA = [
            # just testing a few
            # has_partner req'd
            {
                'error': {'has_partner': [u'This field is required.']},
                'data': {'has_partner': None}
            },
            # is_you_or_your_partner_over_60 req'd
            {
                'error': {'older_than_sixty': [u'This field is required.']},
                'data': {'older_than_sixty': None}
            }
        ]
        for error_data in ERRORS_DATA:
            data = dict(default_data)
            data.update(error_data['data'])

            form = YourDetailsForm(data=data)
            self.assertFalse(form.is_valid())
            self.assertEqual(form.errors, error_data['error'])

    def test_patch_success(self):
        reference = '123456789'
        data = self._get_default_post_data()
        form = YourDetailsForm(reference=reference, data=data)
        self.assertTrue(form.is_valid())
        self.mocked_connection.eligibility_check.patch.return_value = self._get_default_post_data_response()
        response = form.save()
        self.mocked_connection.eligibility_check(reference).patch.assert_called_with(
            {
                'on_passported_benefits': data['has_benefits'],
                'is_you_or_your_partner_over_60': data['older_than_sixty'],
                'has_partner': data['has_partner']
            }
        )
        self.mocked_connection.eligibility_check.assert_called_with(reference)

class YourProblemFormTestCase(CLATestCase):
    def setUp(self):
        super(YourProblemFormTestCase, self).setUp()

        self.mocked_connection.category.get.return_value = mocked_api.CATEGORY_LIST

    def test_get(self):
        form = YourProblemForm()

        choices = form.fields['category'].choices
        self.assertEqual(len(choices), 4)
        self.assertEqual([c[0] for c in choices], ['immigration','abuse','consumer','debt'])
        self.assertEqual(choices[0][1], 'Immigration')  # checking only the first one

    def _get_default_post_data(self):
        return {
            'category': 'debt',
            'your_problem_notes': 'lorem'
        }

    def test_post_success_first_time(self):
        """
        The first time we save the form without passing the eligibility reference,
        we call POST to create an object
        """
        data = self._get_default_post_data()
        form = YourProblemForm(data=data)
        self.assertTrue(form.is_valid())

        response = form.save()
        self.mocked_connection.eligibility_check.post.assert_called_with(data)

    def test_post_success_second_time(self):
        """
        The second time we save the form passing the eligibility reference,
        we call PATCH to update an object
        """
        reference = '1234567890'
        data = self._get_default_post_data()
        form = YourProblemForm(reference=reference, data=data)
        self.assertTrue(form.is_valid())

        response = form.save()
        self.mocked_connection.eligibility_check(reference).patch.assert_called_with(data)

    def test_post_validation_errors(self):
        default_data = self._get_default_post_data()

        ERRORS_DATA = [
            # category mandatory
            {
                'error': {'category': [u'This field is required.']},
                'data': { 'category': None }
            },
            # invalid category
            {
                'error': {'category': [u'Select a valid choice. 3333 is not one of the available choices.']},
                'data': { 'category': 3333 }
            },
            # notes too long
            {
                'error': {'your_problem_notes': [u'Ensure this value has at most 500 characters (it has 501).']},
                'data': { 'your_problem_notes': 's'*501 }
            },
        ]

        for error_data in ERRORS_DATA:
            data = dict(default_data)
            data.update(error_data['data'])

            form = YourProblemForm(data=data)
            self.assertFalse(form.is_valid())
            self.assertEqual(form.errors, error_data['error'])


class YourDisposableIncomeFormTestCase(CLATestCase):
    def setUp(self):
        super(YourDisposableIncomeFormTestCase, self).setUp()

        self.reference = '123456789'
        self.mocked_connection.eligibility_check.post.return_value = mocked_api.ELIGIBILITY_CHECK_DISPOSABLE_INCOME_YOUR_FINANCES
        self.mocked_connection.eligibility_check(self.reference).patch.return_value = mocked_api.ELIGIBILITY_CHECK_DISPOSABLE_INCOME_YOUR_FINANCES

    def _get_default_post_data(self):
        return {
            u'income_tax_and_ni': u'700',
            u'maintenance': u'710',
            u'mortgage_or_rent': u'720',
            u'criminal_legalaid_contributions': u'730',
        }

    def test_fail_save_without_eligibility_check_reference(self):
        """
        The form should raise an Exception if eligibility check is not present
        when saving
        """
        data = self._get_default_post_data()
        form = YourDisposableIncomeForm(data=data)
        self.assertTrue(form.is_valid())

        self.assertRaises(InconsistentStateException, form.save)

    def test_post_update(self):
        """
        PATCH to eligibility_check with a reference already set
        """
        post_data = self._get_default_post_data()
        form = YourDisposableIncomeForm(reference=self.reference, data=post_data)

        self.assertTrue(form.is_valid())

        response_data = form.save()
        self.assertDictEqual(response_data, {
            'eligibility_check': mocked_api.ELIGIBILITY_CHECK_DISPOSABLE_INCOME_YOUR_FINANCES
        })

        expected_data = {}
        for k,v in post_data.items():
            expected_data[k] = int(v) * 100
        self.mocked_connection.eligibility_check(self.reference).patch.assert_called_with({
            'your_finances': expected_data
        })

    def test_form_validation(self):
        default_data = self._get_default_post_data()

        ERRORS_DATA = [
            # mandatory fields
            {
                'error': {
                    u'income_tax_and_ni': [u'This field is required.'],
                    u'maintenance': [u'This field is required.'],
                    u'mortgage_or_rent': [u'This field is required.'],
                    u'criminal_legalaid_contributions': [u'This field is required.'],
                },
                'data': {
                    u'income_tax_and_ni': None,
                    u'maintenance': None,
                    u'mortgage_or_rent': None,
                    u'criminal_legalaid_contributions': None,
                }
            },
            # negative values
            {
                'error': {
                    u'income_tax_and_ni': [u'Ensure this value is greater than or equal to 0.'],
                    u'maintenance': [u'Ensure this value is greater than or equal to 0.'],
                    u'mortgage_or_rent': [u'Ensure this value is greater than or equal to 0.'],
                    u'criminal_legalaid_contributions': [u'Ensure this value is greater than or equal to 0.'],
                },
                'data': {
                    u'income_tax_and_ni': u'-1',
                    u'maintenance': u'-1',
                    u'mortgage_or_rent': u'-1',
                    u'criminal_legalaid_contributions': u'-1',
                }
            },
        ]

        for error_data in ERRORS_DATA:
            data = dict(default_data)
            data.update(error_data['data'])

            form = YourDisposableIncomeForm(reference=self.reference, data=data)
            self.assertFalse(form.is_valid())
            self.assertEqual(form.errors, error_data['error'])


class ApplyFormTestCase(CLATestCase):
    # def setUp(self):
    #     super(ApplyFormTestCase, self).setUp()

    CONTACT_DETAILS_DEFAULT_DATA = {
        'title': 'mr',
        'full_name': 'John Doe',
        'postcode': 'SW1H 9AJ',
        'street': '102 Petty France',
        'town': 'London',
        'mobile_phone': '0123456789',
        'home_phone': '9876543210'
    }

    EXTRA_DEFAULT_DATA = {
        'notes': 'lorem ipsum'
    }

    DEFAULT_CHECK_REFERENCE = 1234567890

    def _get_default_post_data(self):
        cd_data = dict(('contact_details-'+key, val) for key, val in self.CONTACT_DETAILS_DEFAULT_DATA.items())
        extra_data = dict(('extra-'+key, val) for key, val in self.EXTRA_DEFAULT_DATA.items())

        data = {}
        data.update(cd_data)
        data.update(extra_data)
        return data

    def test_form_validation(self):
        default_data = self._get_default_post_data()

        ERRORS_DATA = [
            # mandatory fields (notes is not mandatory)
            {
                'error': {
                    'contact_details': {
                        'title': [u'This field is required.'],
                        'full_name': [u'This field is required.'],
                        'postcode': [u'This field is required.'],
                        'street': [u'This field is required.'],
                        'town': [u'This field is required.'],
                        'mobile_phone': [u'This field is required.'],
                        'home_phone': [u'This field is required.'],
                    }
                },
                'data': {
                    'contact_details-title': None,
                    'contact_details-full_name': None,
                    'contact_details-postcode': None,
                    'contact_details-street': None,
                    'contact_details-town': None,
                    'contact_details-mobile_phone': None,
                    'contact_details-home_phone': None,
                    'extra-notes': None
                }
            },
            # notes too long
            {
                'error': {
                    'contact_details': {
                        'full_name': [u'Ensure this value has at most 300 characters (it has 301).'],
                        'postcode': [u'Ensure this value has at most 10 characters (it has 11).'],
                        'street': [u'Ensure this value has at most 250 characters (it has 251).'],
                        'town': [u'Ensure this value has at most 100 characters (it has 101).'],
                        'mobile_phone': [u'Ensure this value has at most 20 characters (it has 21).'],
                        'home_phone': [u'Ensure this value has at most 20 characters (it has 21).'],
                    },
                    'extra': {
                        'notes': [u'Ensure this value has at most 500 characters (it has 501).']
                    }
                },
                'data': {
                    'contact_details-full_name': u'a'*301,
                    'contact_details-postcode': u'a'*11,
                    'contact_details-street': u'a'*251,
                    'contact_details-town': u'a'*101,
                    'contact_details-mobile_phone': u'a'*21,
                    'contact_details-home_phone': u'a'*21,
                    'extra-notes': u'a'*501
                }
            },
            # invalid title
            {
                'error': {
                    'contact_details': {
                        'title': [u'Select a valid choice. invalid is not one of the available choices.'],
                    }
                },
                'data': {
                    'contact_details-title': u'invalid',
                }
            },
        ]

        for error_data in ERRORS_DATA:
            data = dict(default_data)
            data.update(error_data['data'])

            form = ApplyForm(reference=self.DEFAULT_CHECK_REFERENCE, data=data)
            self.assertFalse(form.is_valid())
            self.assertEqual(form.errors, error_data['error'])

    def test_post_success(self):
        # mocking API response
        self.maxDiff = 0
        mocked_save_response = {
            'reference': 'abcdefg',
            'personal_details': self.CONTACT_DETAILS_DEFAULT_DATA
        }
        self.mocked_connection.case.post.return_value = mocked_save_response

        data = self._get_default_post_data()
        form = ApplyForm(reference=self.DEFAULT_CHECK_REFERENCE, data=data)
        self.assertTrue(form.is_valid())

        response = form.save()
        self.mocked_connection.case.post.assert_called_with({
            'personal_details': self.CONTACT_DETAILS_DEFAULT_DATA,
            'eligibility_check': self.DEFAULT_CHECK_REFERENCE
        })
        self.mocked_connection.eligibility_check(
            self.DEFAULT_CHECK_REFERENCE
        ).patch.assert_called_with(self.EXTRA_DEFAULT_DATA)

        self.assertDictEqual(response, {
            'case': mocked_save_response
        })

    def test_fail_save_without_eligibility_check_reference(self):
        """
        The form should raise an Exception if eligibility check is not present
        when saving
        """
        data = self._get_default_post_data()
        form = ApplyForm(data=data)
        self.assertTrue(form.is_valid())

        self.assertRaises(InconsistentStateException, form.save)

    def test_fail_save_when_not_eligible(self):
        data = self._get_default_post_data()
        form = ApplyForm(reference=self.DEFAULT_CHECK_REFERENCE, data=data)
        self.mocked_connection.eligibility_check(self.DEFAULT_CHECK_REFERENCE).is_eligible().post.return_value = {
            'is_eligible': False
        }

        self.assertTrue(form.is_valid())
        self.assertRaises(InconsistentStateException, form.save)


class ResultFormTestCase(CLATestCase):
    DEFAULT_CHECK_REFERENCE = 1234567890

    def test_post_success(self):
        form = ResultForm(reference=self.DEFAULT_CHECK_REFERENCE, data={})
        self.assertTrue(form.is_valid())

        response = form.save()
        self.assertDictEqual(response, {
            'eligibility_check': {
                'reference': self.DEFAULT_CHECK_REFERENCE
            }
        })

    def test_fail_without_eligibility_check_reference(self):
        form = ResultForm()

        self.assertRaises(InconsistentStateException, form.get_context_data)

    def test_is_eligible_context_var(self):
        form = ResultForm(reference=self.DEFAULT_CHECK_REFERENCE)
        self.mocked_connection.eligibility_check(self.DEFAULT_CHECK_REFERENCE).is_eligible().post.return_value = {
            'is_eligible': True
        }

        self.assertTrue(form.get_context_data()['is_eligible'])

    def test_is_not_eligible_context_var(self):
        form = ResultForm(reference=self.DEFAULT_CHECK_REFERENCE)
        self.mocked_connection.eligibility_check(self.DEFAULT_CHECK_REFERENCE).is_eligible().post.return_value = {
            'is_eligible': False
        }

        self.assertFalse(form.get_context_data()['is_eligible'])
