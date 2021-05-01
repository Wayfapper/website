<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MapControllerTest extends WebTestCase
{
    /**
     * Most basic & simple test.
     *
     * This checks for a basic response of the page and if the map-div is delievered.
     *
     * @return void
     */
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
