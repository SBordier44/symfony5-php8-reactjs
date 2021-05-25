<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Customer;
use App\Entity\Invoice;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    public function findNextChrono(Customer $customer): int
    {
        try {
            $nextChrono = $this->createQueryBuilder('i')
                    ->select('i.chrono')
                    ->join('i.customer', 'c')
                    ->where('i.customer = :customer')
                    ->setParameter('customer', $customer)
                    ->orderBy('i.chrono', 'desc')
                    ->setMaxResults(1)
                    ->getQuery()
                    ->getSingleScalarResult() + 1;
        } catch (ORMException $e) {
            $nextChrono = 1;
        }
        return $nextChrono;
    }
}
