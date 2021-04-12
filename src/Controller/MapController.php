<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MapController extends AbstractController
{
    #[Route('/', name: 'map')]
    public function index(): Response
    {
        $tileServer = (array) $this->getParameter('map.osm.tile');
        shuffle($tileServer);

        return $this->render('map/index.html.twig', [
            'tile_server' => $tileServer[0],
        ]);
    }
}
