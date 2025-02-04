from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Note

class RegistrationTest(APITestCase):
    def test_registration(self):
        """
        Ensure a user can register.
        """
        url = reverse('register')  # 'register' is the name given to the registration URL
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())


class LoginTest(APITestCase):
    def setUp(self):
        # Create a user to test login.
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_login(self):
        """
        Ensure a user can log in and receive JWT tokens.
        """
        url = reverse('token_obtain_pair')  # name set by DRF SimpleJWT view
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that both access and refresh tokens are returned.
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class NotesTest(APITestCase):
    def setUp(self):
        # Create a user and obtain a JWT access token.
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        login_url = reverse('token_obtain_pair')
        login_data = {'username': 'testuser', 'password': 'testpassword'}
        login_response = self.client.post(login_url, login_data, format='json')
        self.token = login_response.data['access']
        # Set the authorization header for subsequent requests.
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_note(self):
        """
        Test that a note can be created.
        """
        url = reverse('note-list')  # With basename 'note' the list URL name is 'note-list'
        data = {
            'title': 'Test Note',
            'content': 'This is a test note.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)
        note = Note.objects.first()
        self.assertEqual(note.title, 'Test Note')
        self.assertEqual(note.content, 'This is a test note.')

    def test_list_notes(self):
        """
        Test that a user can retrieve their own notes.
        """
        # Create two notes.
        Note.objects.create(user=self.user, title='Note 1', content='Content 1')
        Note.objects.create(user=self.user, title='Note 2', content='Content 2')
        url = reverse('note-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify that two notes are returned.
        self.assertEqual(len(response.data), 2)

    def test_update_note(self):
        """
        Test updating an existing note.
        """
        note = Note.objects.create(user=self.user, title='Old Title', content='Old Content')
        url = reverse('note-detail', kwargs={'pk': note.pk})
        data = {
            'title': 'New Title',
            'content': 'New Content'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        note.refresh_from_db()
        self.assertEqual(note.title, 'New Title')
        self.assertEqual(note.content, 'New Content')

    def test_delete_note(self):
        """
        Test that a note can be deleted.
        """
        note = Note.objects.create(user=self.user, title='Delete Me', content='Content')
        url = reverse('note-detail', kwargs={'pk': note.pk})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)
