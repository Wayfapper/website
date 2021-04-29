<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MapControllerTest extends WebTestCase
{
    public function testShowMap(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        // check if the page/route is responding
        self::assertResponseStatusCodeSame(200);
        // the page should have a map-div
        self::assertCount(1, $crawler->filter('div#map'));
    }
}
